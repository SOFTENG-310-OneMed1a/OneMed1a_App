package com.onemed1a.backend.repository;

import com.onemed1a.backend.entity.Friendship;
import com.onemed1a.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    // Find existing friendship between two users (regardless of who initiated)
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user1 AND f.addressee = :user2) OR " +
           "(f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    // Get all accepted friends for a user
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user OR f.addressee = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendshipsByUser(@Param("user") User user);
    
    // Get incoming friend requests (where user is the addressee)
    @Query("SELECT f FROM Friendship f WHERE f.addressee = :user AND f.status = 'PENDING'")
    List<Friendship> findIncomingFriendRequests(@Param("user") User user);
    
    // Get outgoing friend requests (where user is the requester)
    @Query("SELECT f FROM Friendship f WHERE f.requester = :user AND f.status = 'PENDING'")
    List<Friendship> findOutgoingFriendRequests(@Param("user") User user);
    
    // Get all pending requests for a user (both incoming and outgoing)
    @Query("SELECT f FROM Friendship f WHERE " +
           "(f.requester = :user OR f.addressee = :user) AND f.status = 'PENDING'")
    List<Friendship> findAllPendingRequestsByUser(@Param("user") User user);
    
    // Find friendship by ID where user is involved
    @Query("SELECT f FROM Friendship f WHERE f.id = :friendshipId AND " +
           "(f.requester = :user OR f.addressee = :user)")
    Optional<Friendship> findByIdAndUserInvolved(@Param("friendshipId") Long friendshipId, @Param("user") User user);
}
