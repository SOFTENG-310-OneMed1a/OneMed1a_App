package com.onemed1a.backend.media.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.onemed1a.backend.media.MediaData;
import com.onemed1a.backend.media.MediaDataController;
import com.onemed1a.backend.media.MediaDataService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class MediaDataControllerTest {

    private MediaDataController controller;
    private MediaDataService service;

    @BeforeEach
    void setup() {
        service = mock(MediaDataService.class);
        controller = new MediaDataController(service);
    }

    @Test
    void shouldReturnAllMedia() {
        MediaData media = MediaData.builder()
                .mediaId(UUID.randomUUID())
                .title("Test Movie")
                .type(MediaData.MediaType.MOVIE)
                .genres(List.of("Action"))
                .build();

        when(service.getAllMedia(null, null, null, null))
                .thenReturn(List.of(media));

        var result = controller.getAllMedia(null, null, null, null, 1, 10, "title,asc");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Movie");
    }

    @Test
    void shouldReturnMediaById() {
        UUID id = UUID.randomUUID();
        MediaData media = MediaData.builder()
                .mediaId(id)
                .title("Test Movie")
                .type(MediaData.MediaType.MOVIE)
                .genres(List.of("Action"))
                .build();

        when(service.getMediaById(id)).thenReturn(Optional.of(media));

        var result = controller.getMediaById(id);

        assertThat(result.getTitle()).isEqualTo("Test Movie");
    }

    @Test
    void shouldThrowNotFoundForMissingMedia() {
        UUID id = UUID.randomUUID();
        when(service.getMediaById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.getMediaById(id))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Media with id " + id + " not found");
    }
}
