package com.onemed1a.backend.user;


import java.util.List;
import java.util.UUID;
import java.net.URI;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.onemed1a.backend.media.Media;
import com.onemed1a.backend.media.MediaRepository;
import com.onemed1a.backend.user.UserMedia;
import com.onemed1a.backend.user.UserMediaService;
import org.springframework.lang.Nullable;

@RestController
@RequestMapping("/usermedia")
public class UserMediaController {

    private final UserMediaService userMediaService;
    private final Optional<MediaRepository> mediaRepository;

    public UserMediaController(UserMediaService userMediaService, Optional<MediaRepository> mediaRepository) {
        this.userMediaService = userMediaService;
        this.mediaRepository = mediaRepository == null ? Optional.empty() : mediaRepository;
    }

    //Endpoint to return all media statuses for the logged-in user, with optional query parameters: status (media status), type (media type), page (for pagination), size (for pagination), sort (sort based on a field and ascending or descending).
    @GetMapping
    public List<UserMedia> getUserMedia(
            @RequestParam(required = false) UserMedia.Status status,   // WATCHING, COMPLETED, PLAN_TO_WATCH
            @RequestParam(required = false) Media.MediaType type,      // MOVIE, TV, MUSIC, BOOKS
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt,desc") String sort
    ) {
        return userMediaService.getUserMedia(status, type, page, size, sort);
    }

    //Endpoint to return the status of a specific media item for the logged-in user.
    @GetMapping("/{mediaId}")
    public UserMedia getUserMediaByMediaId(@PathVariable UUID mediaId) {
        return userMediaService.getUserMediaByMediaId(mediaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User media with mediaId " + mediaId + " not found"));
    }

    //Create method to create the status of a media item for the logged in user
    @PostMapping
    public ResponseEntity<UserMedia> createUserMediaStatus(@RequestBody UserMediaUpsertRequest body) {
        if (body == null || body.getMediaId() == null || body.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "mediaId and status are required");
        }
        UUID mediaId = body.getMediaId();
        // If the media backend is present, verify the media exists. Otherwise, skip validation.
        mediaRepository.ifPresent(repo -> {
            if (!repo.existsById(mediaId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media " + mediaId + " not found");
            }
        });
        // TODO replace with authenticated user once security is wired
        UUID demoUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        UserMedia saved = userMediaService.upsert(demoUserId, body);
        URI location = URI.create("/usermedia/" + saved.getMediaId());
        return ResponseEntity.created(location).body(saved);
    }

    //Update method to update the status of a media item for the log in user
    @PutMapping("/{mediaId}")
    public UserMedia updateUserMediaStatus(@PathVariable UUID mediaId, @RequestBody UserMediaUpsertRequest body) {
        if (body == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        // Optional media existence check if repo is present
        mediaRepository.ifPresent(repo -> {
            if (!repo.existsById(mediaId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media " + mediaId + " not found");
            }
        });
        // TODO replace with authenticated user once security is wired
        UUID demoUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        return userMediaService.update(demoUserId, mediaId, body)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existing status for media " + mediaId));
    }

    //Delete method to delete the status of a media item for the logged in user
    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> deleteUserMediaStatus(@PathVariable UUID mediaId) {
        // Optional media existence check if repo is present (not strictly required for delete)
        mediaRepository.ifPresent(repo -> {
            if (!repo.existsById(mediaId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Media " + mediaId + " not found");
            }
        });
        // TODO replace with authenticated user once security is wired
        UUID demoUserId = UUID.fromString("00000000-0000-0000-0000-000000000001");
        boolean deleted = userMediaService.delete(demoUserId, mediaId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}