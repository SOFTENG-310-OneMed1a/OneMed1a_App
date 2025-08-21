package com.onemed1a.backend.usermediastatus.dto;

import com.onemed1a.backend.usermediastatus.UserMediaStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * DTO to upsert a {@link UserMediaStatus}.
 * <p>
 * If {@code id} resolves to an existing row, it is updated; otherwise a new row is created
 * for the given {@code userId} and {@code mediaId}. Required: {@code userId}, {@code mediaId},
 * {@code status}. Optional: {@code rating} (1–5), {@code reviewText}. When updating, null
 * optionals leave existing values unchanged.
 *
 * @see UserMediaStatus
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserMediaStatusDTO {

    /** Target record id for update; unused/new for create. */
    private UUID id;

    /** Owner of the status (must exist). */
    private UUID userId;

    /** Media item referenced (must exist). */
    private UUID mediaId;

    /** Lifecycle state (e.g., COMPLETED, WATCHING, PLAN_TO_WATCH). */
    private UserMediaStatus.Status status;

    /** Optional rating (1–5); null on update preserves current rating. */
    private Integer rating;

    /** Optional review text; null on update preserves current text. */
    private String reviewText;
}