package com.onemed1a.backend.usermedia;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMediaRepository extends JpaRepository<UserMedia, Long> {

}