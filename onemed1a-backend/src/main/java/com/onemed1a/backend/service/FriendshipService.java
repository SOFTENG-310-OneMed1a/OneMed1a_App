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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendshipService {
    
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    
    /**
     * Get all accepted friends for the current user
     */
    @Transactional(readOnly = true)
    public List<FriendDTO> getFriends(Long userId) {
        User user = getUserById(userId);
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendshipsByUser(user);
        
        return friendships.stream()
                .map(friendship -> mapToFriendDTO(friendship, user))
                .collect(Collectors.toList());
    }
    
    /**
     * Get all pending friend requests for the current user (both incoming and outgoing)
     */
    @Transactional(readOnly = true)
    public List<FriendRequestDTO> getPendingRequests(Long userId) {
        User user = getUserById(userId);
        
        List<Friendship> incomingRequests = friendshipRepository.findIncomingFriendRequests(user);
        List<Friendship> outgoingRequests = friendshipRepository.findOutgoingFriendRequests(user);
        
        List<FriendRequestDTO> result = incomingRequests.stream()
                .map(friendship -> mapToFriendRequestDTO(friendship, "incoming"))
                .collect(Collectors.toList());
        
        result.addAll(outgoingRequests.stream()
                .map(friendship -> mapToFriendRequestDTO(friendship, "outgoing"))
                .collect(Collectors.toList()));
        
        return result;
    }
    
    /**
     * Send a friend request to another user
     */
    public FriendRequestDTO sendFriendRequest(Long requesterId, Long addresseeId) {
        if (requesterId.equals(addresseeId)) {
            throw new InvalidFriendshipActionException("Cannot send friend request to yourself");
        }
        
        User requester = getUserById(requesterId);
        User addressee = getUserById(addresseeId);
        
        // Check if friendship already exists
        if (friendshipRepository.findFriendshipBetweenUsers(requester, addressee).isPresent()) {
            throw new InvalidFriendshipActionException("Friendship or friend request already exists between these users");
        }
        
        Friendship friendship = Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();
        
        Friendship savedFriendship = friendshipRepository.save(friendship);
        return mapToFriendRequestDTO(savedFriendship, "outgoing");
    }
    
    /**
     * Accept or decline a friend request
     */
    public FriendRequestDTO respondToFriendRequest(Long userId, Long friendshipId, Friendship.FriendshipStatus action) {
        if (action != Friendship.FriendshipStatus.ACCEPTED && action != Friendship.FriendshipStatus.DECLINED) {
            throw new InvalidFriendshipActionException("Invalid action. Must be ACCEPTED or DECLINED");
        }
        
        User user = getUserById(userId);
        Friendship friendship = friendshipRepository.findByIdAndUserInvolved(friendshipId, user)
                .orElseThrow(() -> new FriendshipNotFoundException("Friend request not found"));
        
        if (friendship.getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new InvalidFriendshipActionException("Can only respond to pending friend requests");
        }
        
        // Only the addressee can accept/decline the request
        if (!friendship.getAddressee().getId().equals(userId)) {
            throw new InvalidFriendshipActionException("Only the request recipient can accept or decline the request");
        }
        
        friendship.setStatus(action);
        Friendship updatedFriendship = friendshipRepository.save(friendship);
        
        return mapToFriendRequestDTO(updatedFriendship, "incoming");
    }
    
    /**
     * Remove a friend (delete the friendship)
     */
    public void removeFriend(Long userId, Long friendId) {
        User user = getUserById(userId);
        User friend = getUserById(friendId);
        
        Friendship friendship = friendshipRepository.findFriendshipBetweenUsers(user, friend)
                .orElseThrow(() -> new FriendshipNotFoundException("Friendship not found"));
        
        if (friendship.getStatus() != Friendship.FriendshipStatus.ACCEPTED) {
            throw new InvalidFriendshipActionException("Can only remove accepted friends");
        }
        
        friendshipRepository.delete(friendship);
    }
    
    /**
     * Block a user
     */
    public void blockUser(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new InvalidFriendshipActionException("Cannot block yourself");
        }
        
        User user = getUserById(userId);
        User targetUser = getUserById(targetUserId);
        
        Friendship existingFriendship = friendshipRepository.findFriendshipBetweenUsers(user, targetUser)
                .orElse(null);
        
        if (existingFriendship != null) {
            existingFriendship.setStatus(Friendship.FriendshipStatus.BLOCKED);
            friendshipRepository.save(existingFriendship);
        } else {
            // Create a new blocked relationship
            Friendship blockRelationship = Friendship.builder()
                    .requester(user)
                    .addressee(targetUser)
                    .status(Friendship.FriendshipStatus.BLOCKED)
                    .build();
            friendshipRepository.save(blockRelationship);
        }
    }
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + userId));
    }
    
    private FriendDTO mapToFriendDTO(Friendship friendship, User currentUser) {
        // Get the friend (the other user in the friendship)
        User friend = friendship.getRequester().getId().equals(currentUser.getId()) 
                ? friendship.getAddressee() 
                : friendship.getRequester();
        
        return FriendDTO.builder()
                .id(friend.getId())
                .username(friend.getUsername())
                .firstName(friend.getFirstName())
                .lastName(friend.getLastName())
                .friendshipCreatedAt(friendship.getCreatedAt())
                .build();
    }
    
    private FriendRequestDTO mapToFriendRequestDTO(Friendship friendship, String type) {
        return FriendRequestDTO.builder()
                .id(friendship.getId())
                .requester(FriendRequestDTO.UserInfoDTO.builder()
                        .id(friendship.getRequester().getId())
                        .username(friendship.getRequester().getUsername())
                        .firstName(friendship.getRequester().getFirstName())
                        .lastName(friendship.getRequester().getLastName())
                        .build())
                .addressee(FriendRequestDTO.UserInfoDTO.builder()
                        .id(friendship.getAddressee().getId())
                        .username(friendship.getAddressee().getUsername())
                        .firstName(friendship.getAddressee().getFirstName())
                        .lastName(friendship.getAddressee().getLastName())
                        .build())
                .status(friendship.getStatus())
                .createdAt(friendship.getCreatedAt())
                .type(type)
                .build();
    }
}
