package com.team02.backend.exception;

import lombok.Getter;
import lombok.EqualsAndHashCode;
import org.springframework.http.HttpStatus;

@Getter
@EqualsAndHashCode(callSuper = true)
public class ApplicationException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    public ApplicationException(ErrorCode errorCode) {
        this(null, errorCode);
    }

    public ApplicationException(String message, ErrorCode errorCode) {
        super(resolveMessage(message, errorCode));
        this.errorCode = errorCode.getCode();
        this.httpStatus = errorCode.getHttpStatus();
    }

    public ApplicationException(String message, ErrorCode errorCode, Throwable cause) {
        super(resolveMessage(message, errorCode), cause);
        this.errorCode = errorCode.getCode();
        this.httpStatus = errorCode.getHttpStatus();
    }

    public ApplicationException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    public ApplicationException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    private static String resolveMessage(String message, ErrorCode errorCode) {
        if (message == null || message.isBlank()) {
            return errorCode.getDefaultMessage();
        }
        return message;
    }
}
