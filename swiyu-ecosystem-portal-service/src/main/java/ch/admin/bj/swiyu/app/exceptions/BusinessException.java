package ch.admin.bj.swiyu.app.exceptions;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;

public abstract class BusinessException extends RuntimeException {

    public enum BusinessExceptionErrorCode {
        DATA_INVALID,
        DATA_INVALID_VIRUS_DETECTED,
        RESOURCE_NOT_FOUND,
        RESOURCE_FORBIDDEN,
        ACTION_FORBIDDEN,
        PARTNER_IS_NOT_GOVERNMENTAL,
    }

    @Getter
    private final List<String> additionalDetails;

    @Getter
    private final BusinessExceptionErrorCode errorCode;

    protected BusinessException(String message, BusinessExceptionErrorCode code) {
        super(message);
        this.errorCode = code;
        this.additionalDetails = new ArrayList<>();
    }

    protected BusinessException(String message, BusinessExceptionErrorCode code, Throwable cause) {
        super(message, cause);
        this.errorCode = code;
        this.additionalDetails = new ArrayList<>();
    }

    protected BusinessException(
        String message,
        BusinessExceptionErrorCode code,
        String additionalDetails,
        Throwable cause
    ) {
        super(message, cause);
        this.errorCode = code;
        this.additionalDetails = new ArrayList<>();
        this.additionalDetails.add(additionalDetails);
    }

    protected BusinessException(
        String message,
        BusinessExceptionErrorCode code,
        List<String> additionalDetails,
        Throwable cause
    ) {
        super(message, cause);
        this.errorCode = code;
        this.additionalDetails = additionalDetails;
    }
}
