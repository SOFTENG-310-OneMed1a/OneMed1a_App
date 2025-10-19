package com.onemed1a.backend.config;

import com.onemed1a.backend.repository.MediaDataRepository;
import com.onemed1a.backend.model.User;
import com.onemed1a.backend.repository.UserRepository;
import com.onemed1a.backend.repository.UserMediaStatusRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class SeedDataConfig {

    private final PasswordEncoder passwordEncoder;

    public SeedDataConfig(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner seedData(
            UserRepository users,
            MediaDataRepository media,
            UserMediaStatusRepository statuses
    ) {
        return args -> {
            // idempotency: if anything exists, skip
            if (users.count() > 0) return;

            // --- USERS ---

            var u1 = users.save(User.builder()
                    .firstName("Ava")
                    .lastName("Wright")
                    .email("ava@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .gender(User.Gender.FEMALE)
                    .dateOfBirth(LocalDate.of(1996, 5, 17))
                    .active(true)
                    .build());

            var u2 = users.save(User.builder()
                    .firstName("Liam")
                    .lastName("Patel")
                    .email("liam@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .gender(User.Gender.MALE)
                    .dateOfBirth(LocalDate.of(1993, 11, 2))
                    .active(true)
                    .build());


        };
    }
}
