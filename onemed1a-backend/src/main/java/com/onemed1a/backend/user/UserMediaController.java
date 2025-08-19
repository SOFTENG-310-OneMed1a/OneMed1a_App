package com.onemed1a.backend.user;


import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.onemed1a.backend.media.Media;
import com.onemed1a.backend.user.UserMedia;
import com.onemed1a.backend.user.UserMediaService;

@RestController
@RequestMapping("/usermedia")
public class UserMediaController {

    private final UserMediaService userMediaService;

    public UserMediaController(UserMediaService userMediaService) {
        this.userMediaService = userMediaService;
    }

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
    @GetMapping("/{mediaId}")
    public UserMedia getUserMediaByMediaId(@PathVariable UUID mediaId) {
        return userMediaService.getUserMediaByMediaId(mediaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User media with mediaId " + mediaId + " not found"));
    }
}