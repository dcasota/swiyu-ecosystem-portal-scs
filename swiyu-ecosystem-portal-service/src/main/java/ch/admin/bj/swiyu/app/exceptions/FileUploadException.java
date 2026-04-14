package ch.admin.bj.swiyu.app.exceptions;

import jakarta.annotation.Nullable;
import java.text.MessageFormat;
import java.util.List;

public class FileUploadException extends BusinessException {

    private static final MessageFormat RESOURCE_TYPE_MESSAGE = new MessageFormat("Provided document is invalid.");

    public FileUploadException(String additionalDetails) {
        super(additionalDetails, BusinessExceptionErrorCode.DATA_INVALID);
    }

    public FileUploadException(String additionalDetails, @Nullable Throwable cause) {
        super(
            RESOURCE_TYPE_MESSAGE.format(new String[] {}),
            BusinessExceptionErrorCode.DATA_INVALID,
            additionalDetails,
            cause
        );
    }

    public FileUploadException(List<String> additionalDetails, @Nullable Throwable cause) {
        super(
            RESOURCE_TYPE_MESSAGE.format(new String[] {}),
            BusinessExceptionErrorCode.DATA_INVALID,
            additionalDetails,
            cause
        );
    }
}
