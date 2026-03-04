package com.team02.backend.exception;

public class EmailServiceException extends ApplicationException {

    public EmailServiceException(String message) {
        super(message, ErrorCode.EMAIL_SERVICE_ERROR);
    }

    public EmailServiceException(String message, Throwable cause) {
        super(message, ErrorCode.EMAIL_SERVICE_ERROR, cause);
    }
}
