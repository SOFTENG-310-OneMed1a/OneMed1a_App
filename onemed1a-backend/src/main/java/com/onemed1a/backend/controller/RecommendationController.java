package com.onemed1a.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.onemed1a.backend.dto.RecommendationRequest;
import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.service.OpenAIService;

@RestController
@RequestMapping("/openai")
public class RecommendationController {
    private final OpenAIService openAIService;

    public RecommendationController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/recommendation")
    public List<MediaData> getRecommendation(@RequestBody RecommendationRequest payload) {
        String mediaType = payload.getMediaType();
        String mediaName = payload.getMediaName();
        return openAIService.getRecommendation(mediaType, mediaName);
    }
}
