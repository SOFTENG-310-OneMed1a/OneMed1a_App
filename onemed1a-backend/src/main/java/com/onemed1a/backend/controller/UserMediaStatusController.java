package com.onemed1a.backend.controller;


import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onemed1a.backend.dto.UserMediaStatusDTO;
import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.model.UserMediaStatus;
import com.onemed1a.backend.service.UserMediaStatusService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/usermedia")
public class UserMediaStatusController {

    private final UserMediaStatusService userMediaService;

    public UserMediaStatusController(UserMediaStatusService userMediaService) {
        this.userMediaService = userMediaService;
    }

    //Endpoint to return the status of a specific media item for the logged-in user.
    @GetMapping("/user/{userId}") // was "/{mediaId}"
    public List<UserMediaStatus> getUserMediaByUserId(
            @PathVariable UUID userId,
            @RequestParam(required = false) UserMediaStatus.Status status,
            @RequestParam(required = false) MediaData.MediaType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "updatedAt,desc") String sort
    ) {
        return userMediaService.getUserMedia(userId, status, type);
    }

    //Create method to create and update the status of a media item for the logged in user
    @PostMapping
    public ResponseEntity<UserMediaStatus> createUserMediaStatus(@Valid @RequestBody UserMediaStatusDTO userMediaStatus) {
        return userMediaService.upsert(userMediaStatus);
    }

    //Delete method to delete the status of a media item for the logged in user
    @DeleteMapping("/{statusId}/")
    public ResponseEntity<UUID> deleteUserMediaStatus(@PathVariable ("statusId") UUID statusId) {
        userMediaService.delete(statusId);
        return ResponseEntity.ok(statusId);
    }

    @GetMapping("/{userId}/{mediaId}")
    public ResponseEntity<UserMediaStatus> getStatus(
            @PathVariable UUID userId,
            @PathVariable UUID mediaId) {
        return userMediaService.getStatus(userId, mediaId);
    }

    // Add this endpoint to your controller
    @GetMapping("/user/{userId}/stats")
    public Map<String, Long> getUserMediaStats(@PathVariable UUID userId) {
        return userMediaService.getUserMediaCountsByType(userId);
    }
}