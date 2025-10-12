package com.onemed1a.backend.mapper;

import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.dto.SearchResultItem;
import com.onemed1a.backend.dto.SuggestResultItem;

public final class SearchMappers {
    private SearchMappers() {}

    public static SearchResultItem toResultItem(MediaData m) {
        return SearchResultItem.builder()
                .id(m.getMediaId())
                .title(m.getTitle())
                .type(m.getType())
                .releaseDate(m.getReleaseDate())
                .genres(m.getGenres())
                .build();
    }

    public static SuggestResultItem toSuggestItem(MediaData m) {
        return SuggestResultItem.builder()
                .id(m.getMediaId())
                .title(m.getTitle())
                .type(m.getType())
                .build();
    }
}