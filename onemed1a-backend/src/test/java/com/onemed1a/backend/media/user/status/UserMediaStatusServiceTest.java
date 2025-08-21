package com.onemed1a.backend.media.user.status;

import com.onemed1a.backend.media.MediaData;
import com.onemed1a.backend.media.MediaDataRepository;
import com.onemed1a.backend.user.User;
import com.onemed1a.backend.user.UserRepository;
import com.onemed1a.backend.usermediastatus.UserMediaStatus;
import com.onemed1a.backend.usermediastatus.UserMediaStatusRepository;
import com.onemed1a.backend.usermediastatus.UserMediaStatusService;
import com.onemed1a.backend.usermediastatus.dto.UserMediaStatusDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.onemed1a.backend.media.MediaData.MediaType.MOVIE;
import static com.onemed1a.backend.media.MediaData.MediaType.TV;
import static com.onemed1a.backend.usermediastatus.UserMediaStatus.Status.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class UserMediaStatusServiceTest {

    private UserMediaStatusService service;
    private UserMediaStatusRepository umsRepo;
    private UserRepository userRepo;
    private MediaDataRepository mediaRepo;

    @BeforeEach
    void setup() {
        umsRepo = mock(UserMediaStatusRepository.class);
        userRepo = mock(UserRepository.class);
        mediaRepo = mock(MediaDataRepository.class);
        service = new UserMediaStatusService(umsRepo, userRepo, mediaRepo);
    }

    @Test
    void shouldFilterByStatusAndTypeInGetUserMedia() {
        UUID userId = UUID.randomUUID();

        MediaData movie = mock(MediaData.class);
        when(movie.getType()).thenReturn(MOVIE);
        MediaData tv = mock(MediaData.class);
        when(tv.getType()).thenReturn(TV);

        UserMediaStatus s1 = mock(UserMediaStatus.class);
        when(s1.getStatus()).thenReturn(COMPLETED);
        when(s1.getMedia()).thenReturn(movie);

        UserMediaStatus s2 = mock(UserMediaStatus.class);
        when(s2.getStatus()).thenReturn(WATCHING);
        when(s2.getMedia()).thenReturn(movie);

        UserMediaStatus s3 = mock(UserMediaStatus.class);
        when(s3.getStatus()).thenReturn(COMPLETED);
        when(s3.getMedia()).thenReturn(tv);

        when(umsRepo.findByUser_Id(userId)).thenReturn(List.of(s1, s2, s3));

        var result = service.getUserMedia(userId, COMPLETED, MOVIE);

        assertThat(result).containsExactly(s1);
        verify(umsRepo).findByUser_Id(userId);
    }

    @Test
    void upsert_shouldCreateWhenNoExistingRecord() {
        UUID userId = UUID.randomUUID();
        UUID mediaId = UUID.randomUUID();
        UUID clientProvidedId = UUID.randomUUID(); // UUID provided, not found -> create path

        var dto = new UserMediaStatusDTO(
                clientProvidedId,
                userId,
                mediaId,
                WATCHING,
                4,
                "So far so good"
        );

        User user = mock(User.class);
        MediaData media = mock(MediaData.class);

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(mediaRepo.findById(mediaId)).thenReturn(Optional.of(media));
        when(umsRepo.findById(clientProvidedId)).thenReturn(Optional.empty());

        when(umsRepo.save(any(UserMediaStatus.class))).thenAnswer(inv -> {
            UserMediaStatus e = inv.getArgument(0);
            e.setId(UUID.randomUUID()); // simulate DB id
            return e;
        });

        ResponseEntity<UserMediaStatus> response = service.upsert(dto);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        UserMediaStatus saved = response.getBody();
        assertThat(saved).isNotNull();
        assertThat(saved.getStatus()).isEqualTo(WATCHING);
        assertThat(saved.getRating()).isEqualTo(4);
        assertThat(saved.getReviewText()).isEqualTo("So far so good");

        verify(umsRepo).save(any(UserMediaStatus.class));
    }

    @Test
    void upsert_shouldUpdateWhenExistingRecordFound() {
        UUID userId = UUID.randomUUID();
        UUID mediaId = UUID.randomUUID();
        UUID existingId = UUID.randomUUID();

        var dto = new UserMediaStatusDTO(
                existingId,
                userId,
                mediaId,
                COMPLETED,
                null,               // keep old rating
                "Wrapped it up"
        );

        User user = mock(User.class);
        MediaData media = mock(MediaData.class);

        UserMediaStatus existing = UserMediaStatus.builder()
                .id(existingId)
                .status(WATCHING)
                .rating(3)
                .reviewText("Halfway")
                .build();

        when(userRepo.findById(userId)).thenReturn(Optional.of(user));
        when(mediaRepo.findById(mediaId)).thenReturn(Optional.of(media));
        when(umsRepo.findById(existingId)).thenReturn(Optional.of(existing));
        when(umsRepo.save(existing)).thenAnswer(inv -> inv.getArgument(0));

        ResponseEntity<UserMediaStatus> response = service.upsert(dto);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        UserMediaStatus updated = response.getBody();
        assertThat(updated).isNotNull();
        assertThat(updated.getId()).isEqualTo(existingId);
        assertThat(updated.getStatus()).isEqualTo(COMPLETED);
        assertThat(updated.getRating()).isEqualTo(3);
        assertThat(updated.getReviewText()).isEqualTo("Wrapped it up");

        verify(umsRepo).save(existing);
    }

    @Test
    void upsert_shouldThrowWhenUserMissing() {
        UUID userId = UUID.randomUUID();
        UUID mediaId = UUID.randomUUID();

        var dto = new UserMediaStatusDTO(
                UUID.randomUUID(),
                userId,
                mediaId,
                PLAN_TO_WATCH,
                null,
                null
        );

        when(userRepo.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.upsert(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");

        verify(userRepo).findById(userId);
        verifyNoInteractions(mediaRepo, umsRepo);
    }

    @Test
    void upsert_shouldThrowWhenMediaMissing() {
        UUID userId = UUID.randomUUID();
        UUID mediaId = UUID.randomUUID();

        var dto = new UserMediaStatusDTO(
                UUID.randomUUID(),
                userId,
                mediaId,
                PLAN_TO_WATCH,
                null,
                null
        );

        when(userRepo.findById(userId)).thenReturn(Optional.of(mock(User.class)));
        when(mediaRepo.findById(mediaId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.upsert(dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Media not found");

        verify(userRepo).findById(userId);
        verify(mediaRepo).findById(mediaId);
        verifyNoMoreInteractions(umsRepo);
    }

    @Test
    void delete_shouldCallRepositoryAndReturnFalsePerImplementation() {
        UUID statusId = UUID.randomUUID();
        doNothing().when(umsRepo).deleteById(statusId);

        boolean result = service.delete(statusId);

        assertThat(result).isFalse();
        verify(umsRepo).deleteById(statusId);
    }
}