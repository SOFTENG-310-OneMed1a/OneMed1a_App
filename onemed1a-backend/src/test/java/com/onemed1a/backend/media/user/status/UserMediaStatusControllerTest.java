package com.onemed1a.backend.media.user.status;

import com.onemed1a.backend.media.MediaData;
import com.onemed1a.backend.usermediastatus.UserMediaStatus;
import com.onemed1a.backend.usermediastatus.UserMediaStatusController;
import com.onemed1a.backend.usermediastatus.UserMediaStatusService;
import com.onemed1a.backend.usermediastatus.dto.UserMediaStatusDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserMediaStatusControllerTest {

    private UserMediaStatusController controller;
    private UserMediaStatusService service;

    @BeforeEach
    void setup() {
        service = mock(UserMediaStatusService.class);
        controller = new UserMediaStatusController(service);
    }

    @Test
    void shouldReturnUserMediaByUserIdWithFiltersAndPaging() {
        UUID userId = UUID.randomUUID();

        UserMediaStatus s = UserMediaStatus.builder()
                .id(UUID.randomUUID())
                .status(UserMediaStatus.Status.WATCHING)
                .build();

        when(service.getUserMedia(userId, UserMediaStatus.Status.WATCHING, MediaData.MediaType.MOVIE))
                .thenReturn(List.of(s));

        var result = controller.getUserMediaByUserId(
                userId,
                UserMediaStatus.Status.WATCHING,
                MediaData.MediaType.MOVIE,
                0,
                10,
                "updatedAt,desc"
        );

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(UserMediaStatus.Status.WATCHING);
        verify(service).getUserMedia(userId, UserMediaStatus.Status.WATCHING, MediaData.MediaType.MOVIE);
    }

    @Test
    void shouldCreateOrUpdateStatus() {
        UUID id = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID mediaId = UUID.randomUUID();

        UserMediaStatusDTO dto = new UserMediaStatusDTO(
                id,                       // use a UUID (never null)
                userId,
                mediaId,
                UserMediaStatus.Status.COMPLETED,
                5,
                "Great!"
        );

        UserMediaStatus saved = UserMediaStatus.builder()
                .id(id)
                .status(UserMediaStatus.Status.COMPLETED)
                .rating(5)
                .reviewText("Great!")
                .build();

        when(service.upsert(dto)).thenReturn(ResponseEntity.ok(saved));

        var response = controller.createUserMediaStatus(dto);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(id);
        assertThat(response.getBody().getStatus()).isEqualTo(UserMediaStatus.Status.COMPLETED);
        assertThat(response.getBody().getRating()).isEqualTo(5);

        verify(service).upsert(dto);
    }

    @Test
    void shouldDeleteStatusAndReturnId() {
        UUID statusId = UUID.randomUUID();
        when(service.delete(statusId)).thenReturn(true);

        var response = controller.deleteUserMediaStatus(statusId);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEqualTo(statusId);
        verify(service).delete(statusId);
    }
}