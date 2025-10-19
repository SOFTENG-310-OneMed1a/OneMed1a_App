package com.onemed1a.backend.media.recommendation;

import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.repository.MediaDataRepository;
import com.onemed1a.backend.service.OpenAIService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OpenAIServiceTest {

    private MediaDataRepository mediaDataRepository;
    private OpenAIService openAIService;

    @BeforeEach
    void setup() {
        mediaDataRepository = mock(MediaDataRepository.class);
        // pass a dummy key; we won't call the network
        openAIService = spy(new OpenAIService("dummy-key", mediaDataRepository));

        doReturn(List.of(
            MediaData.builder()
                .title("Some Movie")
                .description("A description")
                .genres(List.of("Action", "Sci-Fi"))
                .releaseDate("2010-07-16")
                .type(MediaData.MediaType.MOVIE)
                .build()
        )).when(openAIService).getRecommendation(anyString(), anyString());

        when(mediaDataRepository.findByTitleAndType(anyString(), any())).thenReturn(Optional.empty());
        when(mediaDataRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void testGetRecommendation_realApi_returnsValidList() {
        var recommendations = openAIService.getRecommendation("MOVIE", "Inception");
        assertNotNull(recommendations);
        assertFalse(recommendations.isEmpty());
    }
}
