package com.onemed1a.backend.dto;

import com.onemed1a.backend.model.MediaData;
import lombok.*;

import java.util.UUID;

/** Minimal payload for autocomplete dropdown */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SuggestResultItem {
    private UUID id;
    private String title;
    private MediaData.MediaType type;
}