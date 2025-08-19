package com.onemed1a.backend.user;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class UserMediaService {
    private MediaRepository mediaRepository;
    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public List<Media> getAllMedia(
            String q, String type, Integer year, String genre,
            int page, int size, String sort) {
        List<Media> mediaList;
        mediaList = mediaRepository.findAll();
        for (Media media : mediaList) {
            // Apply filtering based on parameters
            boolean matches = true;
            if (q != null && !media.getTitle().toLowerCase().contains(q.toLowerCase())) {
                matches = false;
            }
            if (type != null && !media.getType().name().equalsIgnoreCase(type)) {
                matches = false;
            }
            if (year != null && (media.getReleaseDate() == null || !media.getReleaseDate().contains(year.toString()))) {
                matches = false;
            }
            if (genre != null && !media.getGenres().contains(Integer.parseInt(genre))) {
                matches = false;
            }
            if (matches) {
                mediaList.add(media);
            }
        }
        return mediaList;
    }

    public Optional<Media> getMediaById(UUID id) {
        return mediaRepository.findById(id);
        //TODO for if not found
    }

}