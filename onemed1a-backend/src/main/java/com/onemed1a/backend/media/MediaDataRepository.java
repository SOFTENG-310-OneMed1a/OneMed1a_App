package com.onemed1a.backend.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.onemed1a.backend.media.MediaData.MediaType;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MediaDataRepository extends JpaRepository<MediaData, UUID> {
    Optional<MediaData> findByTitleAndType(String title, MediaType type);
}
