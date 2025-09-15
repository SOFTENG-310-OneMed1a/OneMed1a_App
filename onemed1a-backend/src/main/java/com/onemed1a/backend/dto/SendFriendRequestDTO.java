package com.onemed1a.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendFriendRequestDTO {
    @NotNull(message = "User ID is required")
    private Long userId;
}
