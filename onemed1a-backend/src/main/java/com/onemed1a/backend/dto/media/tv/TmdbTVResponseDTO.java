package com.onemed1a.backend.dto.media.tv;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class TmdbTVResponseDTO {
    private int page;
    private List<TmdbTVResponse> results;
}

