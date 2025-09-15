package com.onemed1a.backend.dto;

import com.onemed1a.backend.entity.Friendship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDTO {
    private Long id;
    private UserInfoDTO requester;
    private UserInfoDTO addressee;
    private Friendship.FriendshipStatus status;
    private LocalDateTime createdAt;
    private String type; // "incoming" or "outgoing"

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfoDTO {
        private Long id;
        private String username;
        private String firstName;
        private String lastName;
    }
}
