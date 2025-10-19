package com.onemed1a.backend.service;

import com.onemed1a.backend.dto.UserMediaStatusDTO;
import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.model.MediaData.MediaType;
import com.onemed1a.backend.model.User;
import com.onemed1a.backend.model.UserMediaStatus;
import com.onemed1a.backend.model.UserMediaStatus.Status;
import com.onemed1a.backend.repository.MediaDataRepository;
import com.onemed1a.backend.repository.UserMediaStatusRepository;
import com.onemed1a.backend.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/**
 * Service layer for UserMedia. Implements the logic expected by the controller: - List statuses for
 * a user with optional filters + simple paging/sorting - Get one status by (userId, mediaId) -
 * Upsert (create or update) a status - Update an existing status - Delete a status - Get counts of
 * media items by type for a given user Notes: - This implementation loads from the repository and
 * filters/sorts in-memory to avoid tight coupling to repository query definitions while branches
 * are diverged. - When auth is wired, pass the authenticated userId into these methods.
 */
@Service
public class UserMediaStatusService {

  private final UserMediaStatusRepository userMediaStatusRepository;
  private final UserRepository userRepository;
  private final MediaDataRepository mediaDataRepository;

  public UserMediaStatusService(
      UserMediaStatusRepository userMediaStatusRepository,
      UserRepository userRepository,
      MediaDataRepository mediaDataRepository) {
    this.userMediaStatusRepository = userMediaStatusRepository;
    this.userRepository = userRepository;
    this.mediaDataRepository = mediaDataRepository;
  }

  /**
   * List statuses for a user with optional filters and simple paging/sorting.
   *
   * @param type
   * @param status
   * @param userId
   */
  public List<UserMediaStatus> getUserMedia(UUID userId, Status status, MediaType type) {
    List<UserMediaStatus> userMediaStatusList = userMediaStatusRepository.findByUser_Id(userId);
    return userMediaStatusList.stream()
        .filter(media -> type == null || media.getMedia().getType().equals(type))
        .filter(media -> status == null || media.getStatus().equals(status))
        .toList();
  }

  /** Create or update (upsert) status for (userId, mediaId). Returns the saved entity. */
  public ResponseEntity<UserMediaStatus> upsert(UserMediaStatusDTO userMediaStatusDTO) {

    // Read incoming data from DTO
    UUID id = userMediaStatusDTO.getId();
    UUID userId = userMediaStatusDTO.getUserId();
    UUID mediaId = userMediaStatusDTO.getMediaId();
    Status status = userMediaStatusDTO.getStatus();
    Integer rating = userMediaStatusDTO.getRating(); // may be null
    String reviewText = userMediaStatusDTO.getReviewText(); // may be null

    // Load referenced entities (fail fast if they don't exist)
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    MediaData mediaData =
        mediaDataRepository
            .findById(mediaId)
            .orElseThrow(() -> new IllegalArgumentException("Media not found: " + mediaId));

    UserMediaStatus ums;

    if (id != null) {
      // UPDATE by id
      ums =
          userMediaStatusRepository
              .findById(id)
              .orElseThrow(() -> new IllegalArgumentException("Status not found: " + id));
      // Update fields from DTO (only if provided)
      if (status != null) {
        ums.setStatus(status);
      }
      if (rating != null) {
        ums.setRating(rating);
      }
      if (reviewText != null) {
        ums.setReviewText(reviewText);
      }
    } else {
      // UPSERT by (user, media)
      ums =
          userMediaStatusRepository
              .findByUser_IdAndMedia_MediaId(userId, mediaId)
              .orElse(
                  UserMediaStatus.builder()
                      .user(user)
                      .media(mediaData)
                      .status(status != null ? status : Status.COMPLETED)
                      .rating(rating)
                      .reviewText(reviewText)
                      .build());

      // If found existing, update its fields (only if provided)
      if (ums.getId() != null) {
        if (status != null) {
          ums.setStatus(status);
        }
        if (rating != null) {
          ums.setRating(rating);
        }
        if (reviewText != null) {
          ums.setReviewText(reviewText);
        }
      }
    }

    return ResponseEntity.ok().body(userMediaStatusRepository.save(ums));
  }

  public ResponseEntity<UserMediaStatus> getStatus(UUID userId, UUID mediaId) {
    return userMediaStatusRepository
        .findByUser_IdAndMedia_MediaId(userId, mediaId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * Delete the status for (userId, mediaId) or by id. Returns true if something was deleted.
   *
   * @return a boolean to see if it deleted the media status correctly.
   */
  public boolean delete(UUID statusId) {
    try {
      // Check if the item exists before deleting
      boolean exists = userMediaStatusRepository.existsById(statusId);
      if (exists) {
        userMediaStatusRepository.deleteById(statusId);
        return true; // Return true when successfully deleted
      }
      return false; // Return false if item doesn't exist
    } catch (RuntimeException e) {
      throw new IllegalArgumentException(e);
    }
  }

  /**
   * Get counts of media items by type for a given user.
   *
   * @param userId the user's UUID
   * @return a map with counts for each media type (movieCount, tvCount, musicCount, booksCount)
   */
  public Map<String, Long> getUserMediaCountsByType(UUID userId) {
    List<UserMediaStatus> userMedia = userMediaStatusRepository.findByUser_Id(userId);

    Map<MediaData.MediaType, Long> counts =
        userMedia.stream()
            .collect(
                Collectors.groupingBy(
                    (UserMediaStatus status) -> status.getMedia().getType(),
                    Collectors.counting()));

    return Map.of(
        "movieCount", counts.getOrDefault(MediaData.MediaType.MOVIE, 0L),
        "tvCount", counts.getOrDefault(MediaData.MediaType.TV, 0L),
        "musicCount", counts.getOrDefault(MediaData.MediaType.MUSIC, 0L),
        "booksCount", counts.getOrDefault(MediaData.MediaType.BOOKS, 0L));
  }
}
