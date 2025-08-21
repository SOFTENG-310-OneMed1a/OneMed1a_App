package com.onemed1a.backend.media;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MediaDataService {
    private final MediaDataRepository mediaDataRepository;
    public MediaDataService(MediaDataRepository mediaDataRepository) {
        this.mediaDataRepository = mediaDataRepository;
    }

    public List<MediaData> getAllMedia(
        String q, String type, Integer year, String genre) {

        List<MediaData> allMedia = mediaDataRepository.findAll();
            return allMedia.stream()
                .filter(media -> q == null || media.getTitle().toLowerCase().contains(q.toLowerCase()))
                .filter(media -> type == null || media.getType().name().equalsIgnoreCase(type))
                .filter(media -> year == null || (media.getReleaseDate() != null && media.getReleaseDate().contains(year.toString())))
                .filter(media -> genre == null || (media.getGenres() != null && media.getGenres().contains(genre)))
                .toList(); 
}


    public Optional<MediaData> getMediaById(UUID id) {
        return mediaDataRepository.findById(id);
    }

}