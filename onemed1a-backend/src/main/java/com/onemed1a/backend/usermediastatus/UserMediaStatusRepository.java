package com.onemed1a.backend.usermediastatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserMediaStatusRepository extends JpaRepository<UserMediaStatus, UUID> {

    // all statuses for a user
    List<UserMediaStatus> findByUser_Id(UUID userId);

}