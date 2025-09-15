package com.onemed1a.backend.dto;

import com.onemed1a.backend.entity.Friendship;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespondToFriendRequestDTO {
    @NotNull(message = "Action is required")
    private Friendship.FriendshipStatus action; // ACCEPTED or DECLINED
}
