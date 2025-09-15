package com.onemed1a.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDateTime friendshipCreatedAt;
}
