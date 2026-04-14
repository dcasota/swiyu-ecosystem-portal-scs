package ch.admin.bj.swiyu.app.service;

import ch.admin.bj.swiyu.app.api.TrustOnboardingSubmissionDto;
import ch.admin.bj.swiyu.client.business.internal.model.TrustOnboardingSubmission;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TrustOnboardingSubmissionMapper {

    public static TrustOnboardingSubmissionDto toTrustOnboardingSubmissionDto(TrustOnboardingSubmission apiDto) {
        return new TrustOnboardingSubmissionDto(
            apiDto.getId(),
            apiDto.getVersion(),
            apiDto.getPartnerId(),
            apiDto.getEntityName(),
            apiDto.getEntityEmail(),
            apiDto.getAddress(),
            apiDto.getContactPerson(),
            apiDto.getStatus(),
            apiDto.getProofOfPossessions(),
            apiDto.getIsGovActor(), //NOSONAR will be changed with EID-5292
            apiDto.getRegistryIds(),
            apiDto.getRejectionReason(),
            apiDto.getDeclineReason(),
            apiDto.getPartnerNote(),
            apiDto.getCorrespondingLanguage(),
            apiDto.getInitiatedAt(),
            apiDto.getSubmittedAt()
        );
    }
}
