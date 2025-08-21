package com.onemed1a.backend.media;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/media")

public class MediaDataController {
    private MediaDataService mediaDataService;
    public MediaDataController(MediaDataService mediaDataService) {
        this.mediaDataService = mediaDataService;
    }
    @RequestMapping
    public List<MediaData> getAllMedia(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer year,
        @RequestParam(required = false) String genre,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "title,asc") String sort
    ) {
        return mediaDataService.getAllMedia(q, type, year, genre);
    }
    @RequestMapping("/{id}")
    public MediaData getMediaById(@PathVariable UUID id) {
        return mediaDataService.getMediaById(id)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND, "Media with id " + id + " not found"));
    }
}

