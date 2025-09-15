package com.onemed1a.backend.service;

import com.onemed1a.backend.dto.FriendDTO;
import com.onemed1a.backend.dto.FriendRequestDTO;
import com.onemed1a.backend.entity.Friendship;
import com.onemed1a.backend.entity.User;
import com.onemed1a.backend.exception.FriendshipNotFoundException;
import com.onemed1a.backend.exception.InvalidFriendshipActionException;
import com.onemed1a.backend.exception.UserNotFoundException;
import com.onemed1a.backend.repository.FriendshipRepository;
import com.onemed1a.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FriendshipServiceTest {

    @Mock
    private FriendshipRepository friendshipRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FriendshipService friendshipService;

    private User user1;
    private User user2;
    private Friendship friendship;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .id(1L)
                .username("user1")
                .email("user1@example.com")
                .firstName("John")
                .lastName("Doe")
                .build();

        user2 = User.builder()
                .id(2L)
                .username("user2")
                .email("user2@example.com")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        friendship = Friendship.builder()
                .id(1L)
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.ACCEPTED)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getFriends_WhenUserExists_ShouldReturnFriendsList() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(friendshipRepository.findAcceptedFriendshipsByUser(user1))
                .thenReturn(List.of(friendship));

        // When
        List<FriendDTO> result = friendshipService.getFriends(1L);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(2L);
        assertThat(result.get(0).getUsername()).isEqualTo("user2");
    }

    @Test
    void getFriends_WhenUserNotExists_ShouldThrowUserNotFoundException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> friendshipService.getFriends(1L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found with id: 1");
    }

    @Test
    void sendFriendRequest_WhenValid_ShouldCreateFriendRequest() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findFriendshipBetweenUsers(user1, user2))
                .thenReturn(Optional.empty());
        when(friendshipRepository.save(any(Friendship.class))).thenReturn(friendship);

        // When
        FriendRequestDTO result = friendshipService.sendFriendRequest(1L, 2L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getRequester().getId()).isEqualTo(1L);
        assertThat(result.getAddressee().getId()).isEqualTo(2L);
        assertThat(result.getType()).isEqualTo("outgoing");
        verify(friendshipRepository).save(any(Friendship.class));
    }

    @Test
    void sendFriendRequest_WhenSelfRequest_ShouldThrowException() {
        // When & Then
        assertThatThrownBy(() -> friendshipService.sendFriendRequest(1L, 1L))
                .isInstanceOf(InvalidFriendshipActionException.class)
                .hasMessage("Cannot send friend request to yourself");
    }

    @Test
    void sendFriendRequest_WhenFriendshipExists_ShouldThrowException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findFriendshipBetweenUsers(user1, user2))
                .thenReturn(Optional.of(friendship));

        // When & Then
        assertThatThrownBy(() -> friendshipService.sendFriendRequest(1L, 2L))
                .isInstanceOf(InvalidFriendshipActionException.class)
                .hasMessage("Friendship or friend request already exists between these users");
    }

    @Test
    void respondToFriendRequest_WhenAccepted_ShouldUpdateStatus() {
        // Given
        Friendship pendingFriendship = Friendship.builder()
                .id(1L)
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findByIdAndUserInvolved(1L, user2))
                .thenReturn(Optional.of(pendingFriendship));
        when(friendshipRepository.save(any(Friendship.class))).thenReturn(pendingFriendship);

        // When
        FriendRequestDTO result = friendshipService.respondToFriendRequest(2L, 1L, 
                Friendship.FriendshipStatus.ACCEPTED);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(Friendship.FriendshipStatus.ACCEPTED);
        verify(friendshipRepository).save(pendingFriendship);
    }

    @Test
    void respondToFriendRequest_WhenNotAddressee_ShouldThrowException() {
        // Given
        Friendship pendingFriendship = Friendship.builder()
                .id(1L)
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(friendshipRepository.findByIdAndUserInvolved(1L, user1))
                .thenReturn(Optional.of(pendingFriendship));

        // When & Then
        assertThatThrownBy(() -> friendshipService.respondToFriendRequest(1L, 1L, 
                Friendship.FriendshipStatus.ACCEPTED))
                .isInstanceOf(InvalidFriendshipActionException.class)
                .hasMessage("Only the request recipient can accept or decline the request");
    }

    @Test
    void removeFriend_WhenValid_ShouldDeleteFriendship() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findFriendshipBetweenUsers(user1, user2))
                .thenReturn(Optional.of(friendship));

        // When
        friendshipService.removeFriend(1L, 2L);

        // Then
        verify(friendshipRepository).delete(friendship);
    }

    @Test
    void removeFriend_WhenFriendshipNotExists_ShouldThrowException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findFriendshipBetweenUsers(user1, user2))
                .thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> friendshipService.removeFriend(1L, 2L))
                .isInstanceOf(FriendshipNotFoundException.class)
                .hasMessage("Friendship not found");
    }

    @Test
    void blockUser_WhenValid_ShouldCreateBlockedRelationship() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(friendshipRepository.findFriendshipBetweenUsers(user1, user2))
                .thenReturn(Optional.empty());
        when(friendshipRepository.save(any(Friendship.class))).thenReturn(friendship);

        // When
        friendshipService.blockUser(1L, 2L);

        // Then
        verify(friendshipRepository).save(any(Friendship.class));
    }

    @Test
    void blockUser_WhenSelfBlock_ShouldThrowException() {
        // When & Then
        assertThatThrownBy(() -> friendshipService.blockUser(1L, 1L))
                .isInstanceOf(InvalidFriendshipActionException.class)
                .hasMessage("Cannot block yourself");
    }
}
