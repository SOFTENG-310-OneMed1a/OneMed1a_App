package com.onemed1a.backend.media.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.onemed1a.backend.media.MediaData;
import com.onemed1a.backend.media.MediaDataRepository;
import com.onemed1a.backend.media.MediaDataService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class MediaDataServiceTest {

    private MediaDataService service;
    private MediaDataRepository repository;

    @BeforeEach
    void setup() {
        repository = mock(MediaDataRepository.class);
        service = new MediaDataService(repository);
    }

    @Test
    void shouldReturnAllMedia() {
        MediaData media = MediaData.builder()
                .mediaId(UUID.randomUUID())
                .title("Test Movie")
                .type(MediaData.MediaType.MOVIE)
                .releaseDate("2023")
                .genres(List.of("Action"))
                .build();

        when(repository.findAll()).thenReturn(List.of(media));

        var result = service.getAllMedia(null, null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Movie");
        verify(repository).findAll();
    }

    @Test
    void shouldReturnFilteredMediaByType() {
        MediaData movie = MediaData.builder()
                .mediaId(UUID.randomUUID())
                .title("Movie 1")
                .type(MediaData.MediaType.MOVIE)
                .genres(List.of("Action"))
                .releaseDate("2023")
                .build();

        MediaData tv = MediaData.builder()
                .mediaId(UUID.randomUUID())
                .title("TV Show")
                .type(MediaData.MediaType.TV)
                .genres(List.of("Drama"))
                .releaseDate("2022")
                .build();

        when(repository.findAll()).thenReturn(List.of(movie, tv));

        var result = service.getAllMedia(null, "MOVIE", null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(MediaData.MediaType.MOVIE);
    }

    @Test
    void shouldReturnMediaById() {
        UUID id = UUID.randomUUID();
        MediaData media = MediaData.builder()
                .mediaId(id)
                .title("Test")
                .type(MediaData.MediaType.MOVIE)
                .genres(List.of("Action"))
                .releaseDate("2023")
                .build();

        when(repository.findById(id)).thenReturn(Optional.of(media));

        var result = service.getMediaById(id);

        assertThat(result).isPresent();
        assertThat(result.get().getTitle()).isEqualTo("Test");
    }
}
