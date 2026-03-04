package com.team02.backend.exception;

import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Getter
public class ValidationException extends ApplicationException {

    private final Map<String, String> violations;

    public ValidationException(String message) {
        super(message, ErrorCode.VALIDATION_ERROR);
        this.violations = new HashMap<>();
    }

    public ValidationException(String message, Map<String, String> violations) {
        super(message, ErrorCode.VALIDATION_ERROR);
        this.violations = violations == null ? new HashMap<>() : new HashMap<>(violations);
    }

    public ValidationException(String fieldName, String errorMessage) {
        super("Validation failed", ErrorCode.VALIDATION_ERROR);
        this.violations = new HashMap<>();
        this.violations.put(fieldName, errorMessage);
    }
}
