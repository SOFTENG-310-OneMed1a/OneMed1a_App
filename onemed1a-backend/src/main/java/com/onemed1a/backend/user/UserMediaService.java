package com.onemed1a.backend.user;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.onemed1a.backend.user.UserMedia;
import com.onemed1a.backend.user.UserMediaController;

/**
 * Service layer for UserMedia. Implements the logic expected by the controller:
 * - List statuses for a user with optional filters + simple paging/sorting
 * - Get one status by (userId, mediaId)
 * - Upsert (create or update) a status
 * - Update an existing status
 * - Delete a status
 *
 * Notes:
 * - This implementation loads from the repository and filters/sorts in-memory
 *   to avoid tight coupling to repository query definitions while branches are diverged.
 * - When auth is wired, pass the authenticated userId into these methods.
 */
public class UserMediaService {
    private final UserMediaRepository userMediaRepository;

    public UserMediaService(UserMediaRepository userMediaRepository) {
        this.userMediaRepository = userMediaRepository;
    }

    /** List statuses for a user with optional filters and simple paging/sorting. */
    public List<UserMedia> getUserMedia(
            UUID userId,
            UserMedia.Status status,
            com.onemed1a.backend.media.Media.MediaType type,
            int page,
            int size,
            String sort
    ) {
        // 1) Load candidate rows (prefer repository filter by user if available)
        List<UserMedia> source;
        try {
            source = userMediaRepository.findByUserId(userId);
        } catch (Throwable t) {
            // Fallback if repository method isn't defined yet
            source = userMediaRepository.findAll();
            List<UserMedia> onlyMine = new ArrayList<>();
            for (UserMedia um : source) {
                if (userId != null && userId.equals(um.getUserId())) {
                    onlyMine.add(um);
                }
            }
            source = onlyMine;
        }

        // 2) Apply optional filters
        List<UserMedia> filtered = new ArrayList<>();
        for (UserMedia um : source) {
            boolean matches = true;

            if (status != null && um.getStatus() != status) {
                matches = false;
            }

            if (matches && type != null) {
                // Try to filter by media type if available on the entity via a direct field or a nested media
                boolean typeMatches = false;
                try {
                    // Prefer a direct getter if present
                    var mtypeMethod = um.getClass().getMethod("getMediaType");
                    Object mt = mtypeMethod.invoke(um);
                    if (mt != null) {
                        typeMatches = type.name().equals(mt.toString());
                    }
                } catch (ReflectiveOperationException ignored) {
                    // Fallback: check nested media if present
                    try {
                        var mediaMethod = um.getClass().getMethod("getMedia");
                        Object mediaObj = mediaMethod.invoke(um);
                        if (mediaObj != null) {
                            var typeMethod = mediaObj.getClass().getMethod("getType");
                            Object mt = typeMethod.invoke(mediaObj);
                            if (mt != null) {
                                typeMatches = type.name().equals(mt.toString());
                            }
                        }
                    } catch (ReflectiveOperationException ignored2) {
                        // If neither is available in this branch, skip type filtering
                        typeMatches = true; // do not exclude in absence of information
                    }
                }
                if (!typeMatches) {
                    matches = false;
                }
            }

            if (matches) {
                filtered.add(um);
            }
        }

        // 3) Sort (supports common fields; defaults to updatedAt desc)
        String[] parts = (sort == null ? "" : sort).split(",", 2);
        String field = parts.length > 0 && !parts[0].isBlank() ? parts[0] : "updatedAt";
        String dir   = parts.length > 1 ? parts[1] : "desc";

        Comparator<UserMedia> comparator;
        switch (field) {
            case "updatedAt":
                comparator = Comparator.comparing(UserMedia::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "createdAt":
                comparator = Comparator.comparing(UserMedia::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "rating":
                comparator = Comparator.comparing(um -> Optional.ofNullable(um.getRating()).orElse(Integer.MIN_VALUE));
                break;
            case "status":
                comparator = Comparator.comparing(um -> um.getStatus() == null ? "" : um.getStatus().name());
                break;
            default:
                comparator = Comparator.comparing(UserMedia::getUpdatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
        }
        if ("desc".equalsIgnoreCase(dir)) {
            comparator = comparator.reversed();
        }
        filtered.sort(comparator);

        // 4) Simple paging (0-based)
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        int from = Math.min(page * size, filtered.size());
        int to   = Math.min(from + size, filtered.size());
        return new ArrayList<>(filtered.subList(from, to));
    }

    /** Get a single status row for (userId, mediaId). */
    public Optional<UserMedia> findByUserIdAndMediaId(UUID userId, UUID mediaId) {
        // Prefer a repository method if present; otherwise filter in-memory
        try {
            return userMediaRepository.findByUserIdAndMediaId(userId, mediaId);
        } catch (Throwable t) {
            List<UserMedia> all = userMediaRepository.findAll();
            for (UserMedia um : all) {
                if (userId.equals(um.getUserId()) && mediaId.equals(um.getMediaId())) {
                    return Optional.of(um);
                }
            }
            return Optional.empty();
        }
    }

    /** Create or update (upsert) status for (userId, mediaId). Returns the saved entity. */
    public UserMedia upsert(UUID userId, UserMediaUpsertRequest body) {
        UUID mediaId = body.getMediaId();
        Optional<UserMedia> existing = findByUserIdAndMediaId(userId, mediaId);
        UserMedia target = existing.orElseGet(UserMedia::new);

        // Set identity fields if creating
        if (target.getUserId() == null) target.setUserId(userId);
        if (target.getMediaId() == null) target.setMediaId(mediaId);

        // Update mutable fields
        if (body.getStatus() != null)    target.setStatus(body.getStatus());
        if (body.getRating() != null)    target.setRating(body.getRating());
        if (body.getReviewText() != null) target.setReviewText(body.getReviewText());

        return userMediaRepository.save(target);
    }

    /** Update existing status for (userId, mediaId). Returns Optional.empty() if none exists. */
    public Optional<UserMedia> update(UUID userId, UUID mediaId, UserMediaUpsertRequest body) {
        Optional<UserMedia> existing = findByUserIdAndMediaId(userId, mediaId);
        if (existing.isEmpty()) return Optional.empty();
        UserMedia target = existing.get();

        if (body.getStatus() != null)     target.setStatus(body.getStatus());
        if (body.getRating() != null)     target.setRating(body.getRating());
        if (body.getReviewText() != null) target.setReviewText(body.getReviewText());

        return Optional.of(userMediaRepository.save(target));
    }

    /** Delete the status for (userId, mediaId). Returns true if something was deleted. */
    public boolean delete(UUID userId, UUID mediaId) {
        Optional<UserMedia> existing = findByUserIdAndMediaId(userId, mediaId);
        if (existing.isEmpty()) return false;
        userMediaRepository.delete(existing.get());
        return true;
    }
}