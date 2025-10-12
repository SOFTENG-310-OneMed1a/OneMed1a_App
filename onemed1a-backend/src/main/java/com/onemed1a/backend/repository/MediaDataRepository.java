package com.onemed1a.backend.repository;

import com.onemed1a.backend.model.MediaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.onemed1a.backend.model.MediaData.MediaType;

import java.util.Optional;
import java.util.UUID;

public interface MediaDataRepository
        extends JpaRepository<MediaData, UUID>, JpaSpecificationExecutor<MediaData> {
    Optional<MediaData> findByTitleAndType(String title, MediaType mediaTypeEnum);
}
