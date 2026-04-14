package ch.admin.bj.swiyu.app.api;

import ch.admin.bj.swiyu.client.business.internal.model.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.Getter;

@Schema(name = "TrustOnboardingSubmission")
public record TrustOnboardingSubmissionDto(
    @NotNull UUID id,
    @NotNull Long version,
    @NotNull @Getter UUID partnerId,
    @NotNull @Getter MultiLanguageText entityName,
    @NotNull @Getter String entityEmail,
    @NotNull @Getter Address entityAddress,
    @NotNull @Getter Contact contactPerson,
    @NotNull TrustOnboardingSubmissionStatus status,
    @NotNull @Getter List<ProofOfPossession> proofOfPossessionList,
    @NotNull @Getter Boolean isGovActor,
    @NotNull @Getter Map<String, String> registryIds,
    @Getter String rejectionReason,
    @Getter String declineReason,
    @Getter String partnerNote,
    @Getter Language correspondingLanguage,
    @Schema(example = "2024-10-29T09:35:16.809924Z") @Nullable @Getter Instant initiatedAt,
    @Schema(example = "2024-10-29T09:35:16.809924Z") @Nullable @Getter Instant submittedAt
) {}
