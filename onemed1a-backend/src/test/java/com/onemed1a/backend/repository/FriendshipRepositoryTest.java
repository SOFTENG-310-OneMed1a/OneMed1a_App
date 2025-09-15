package com.onemed1a.backend.repository;

import com.onemed1a.backend.entity.Friendship;
import com.onemed1a.backend.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class FriendshipRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private FriendshipRepository friendshipRepository;

    private User user1;
    private User user2;
    private User user3;

    @BeforeEach
    void setUp() {
        user1 = User.builder()
                .username("user1")
                .email("user1@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .build();

        user2 = User.builder()
                .username("user2")
                .email("user2@example.com")
                .password("password123")
                .firstName("Jane")
                .lastName("Smith")
                .build();

        user3 = User.builder()
                .username("user3")
                .email("user3@example.com")
                .password("password123")
                .firstName("Bob")
                .lastName("Johnson")
                .build();

        user1 = entityManager.persistAndFlush(user1);
        user2 = entityManager.persistAndFlush(user2);
        user3 = entityManager.persistAndFlush(user3);
    }

    @Test
    void findFriendshipBetweenUsers_WhenFriendshipExists_ShouldReturnFriendship() {
        // Given
        Friendship friendship = Friendship.builder()
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.ACCEPTED)
                .build();
        entityManager.persistAndFlush(friendship);

        // When
        Optional<Friendship> result = friendshipRepository.findFriendshipBetweenUsers(user1, user2);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getRequester()).isEqualTo(user1);
        assertThat(result.get().getAddressee()).isEqualTo(user2);
    }

    @Test
    void findFriendshipBetweenUsers_WhenFriendshipExistsInReverse_ShouldReturnFriendship() {
        // Given
        Friendship friendship = Friendship.builder()
                .requester(user2)
                .addressee(user1)
                .status(Friendship.FriendshipStatus.ACCEPTED)
                .build();
        entityManager.persistAndFlush(friendship);

        // When
        Optional<Friendship> result = friendshipRepository.findFriendshipBetweenUsers(user1, user2);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getRequester()).isEqualTo(user2);
        assertThat(result.get().getAddressee()).isEqualTo(user1);
    }

    @Test
    void findAcceptedFriendshipsByUser_ShouldReturnOnlyAcceptedFriendships() {
        // Given
        Friendship acceptedFriendship = Friendship.builder()
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.ACCEPTED)
                .build();
        
        Friendship pendingFriendship = Friendship.builder()
                .requester(user1)
                .addressee(user3)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();

        entityManager.persistAndFlush(acceptedFriendship);
        entityManager.persistAndFlush(pendingFriendship);

        // When
        List<Friendship> result = friendshipRepository.findAcceptedFriendshipsByUser(user1);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Friendship.FriendshipStatus.ACCEPTED);
    }

    @Test
    void findIncomingFriendRequests_ShouldReturnPendingRequestsWhereUserIsAddressee() {
        // Given
        Friendship incomingRequest = Friendship.builder()
                .requester(user2)
                .addressee(user1)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();
        
        Friendship outgoingRequest = Friendship.builder()
                .requester(user1)
                .addressee(user3)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();

        entityManager.persistAndFlush(incomingRequest);
        entityManager.persistAndFlush(outgoingRequest);

        // When
        List<Friendship> result = friendshipRepository.findIncomingFriendRequests(user1);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAddressee()).isEqualTo(user1);
        assertThat(result.get(0).getRequester()).isEqualTo(user2);
    }

    @Test
    void findOutgoingFriendRequests_ShouldReturnPendingRequestsWhereUserIsRequester() {
        // Given
        Friendship outgoingRequest = Friendship.builder()
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();
        
        Friendship incomingRequest = Friendship.builder()
                .requester(user3)
                .addressee(user1)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();

        entityManager.persistAndFlush(outgoingRequest);
        entityManager.persistAndFlush(incomingRequest);

        // When
        List<Friendship> result = friendshipRepository.findOutgoingFriendRequests(user1);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getRequester()).isEqualTo(user1);
        assertThat(result.get(0).getAddressee()).isEqualTo(user2);
    }

    @Test
    void findByIdAndUserInvolved_ShouldReturnFriendshipWhenUserIsInvolved() {
        // Given
        Friendship friendship = Friendship.builder()
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();
        Friendship savedFriendship = entityManager.persistAndFlush(friendship);

        // When
        Optional<Friendship> result = friendshipRepository.findByIdAndUserInvolved(
                savedFriendship.getId(), user1);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(savedFriendship.getId());
    }

    @Test
    void findByIdAndUserInvolved_ShouldReturnEmptyWhenUserNotInvolved() {
        // Given
        Friendship friendship = Friendship.builder()
                .requester(user1)
                .addressee(user2)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();
        Friendship savedFriendship = entityManager.persistAndFlush(friendship);

        // When
        Optional<Friendship> result = friendshipRepository.findByIdAndUserInvolved(
                savedFriendship.getId(), user3);

        // Then
        assertThat(result).isEmpty();
    }
}
