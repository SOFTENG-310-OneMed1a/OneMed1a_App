package com.onemed1a.backend.media.recommendation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onemed1a.backend.controller.RecommendationController;
import com.onemed1a.backend.dto.RecommendationRequest;
import com.onemed1a.backend.model.MediaData;
import com.onemed1a.backend.service.OpenAIService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class RecommendationControllerTest {

    private OpenAIService openAIService;
    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        openAIService = Mockito.mock(OpenAIService.class);
        RecommendationController controller = new RecommendationController(openAIService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        // Return a minimal valid recommendation payload
        MediaData rec = MediaData.builder()
                .title("Some Movie")
                .description("A description")
                .genres(List.of("Action", "Sci-Fi"))
                .releaseDate("2010-07-16")
                .type(MediaData.MediaType.MOVIE)
                .build();

        Mockito.when(openAIService.getRecommendation(anyString(), anyString()))
            .thenReturn(List.of(rec));
    }

    @Test
    void testGetRecommendationEndpoint() throws Exception {
        RecommendationRequest request = new RecommendationRequest();
        request.setMediaType("MOVIE");
        request.setMediaName("Inception");

        mockMvc.perform(post("/openai/recommendation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Some Movie"))
                .andExpect(jsonPath("$[0].description").exists())
                .andExpect(jsonPath("$[0].genres").isArray())
                .andExpect(jsonPath("$[0].releaseDate").value("2010-07-16"))
                .andExpect(jsonPath("$[0].type").value("MOVIE"));
    }
}
