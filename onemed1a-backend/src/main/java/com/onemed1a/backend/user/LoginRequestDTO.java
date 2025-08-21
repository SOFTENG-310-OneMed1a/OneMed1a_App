package com.onemed1a.backend.user;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String email;
    private String password;
}