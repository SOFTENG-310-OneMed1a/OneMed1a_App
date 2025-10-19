package com.onemed1a.backend.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.onemed1a.backend.model.User.Gender;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserDTO {
    UUID id;
    String firstName;
    String lastName;
    String email;
    Gender gender;
    LocalDate dateOfBirth;
    boolean active;
    OffsetDateTime createdAt;
}
