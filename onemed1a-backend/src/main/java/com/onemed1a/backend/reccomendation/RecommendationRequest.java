package com.onemed1a.backend.reccomendation;

    // DTO for request
public class RecommendationRequest {
    private String mediaType;
    private String mediaName;

    // Getters & setters
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public String getMediaName() { return mediaName; }
    public void setMediaName(String mediaName) { this.mediaName = mediaName; }
}