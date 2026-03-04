package com.team02.backend.exception;

public class UnauthorizedException extends ApplicationException {

    public UnauthorizedException(String message) {
        super(message, ErrorCode.UNAUTHORIZED);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, ErrorCode.UNAUTHORIZED, cause);
    }
}
