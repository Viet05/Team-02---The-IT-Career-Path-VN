package com.team02.backend.exception;

public class DuplicateResourceException extends ApplicationException {

    public DuplicateResourceException(String resourceName, Object identifier) {
        super(
                String.format("%s already exists with id: %s", resourceName, identifier),
                ErrorCode.DUPLICATE_RESOURCE);
    }

    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(
                String.format("%s already exists with %s: %s", resourceName, fieldName, fieldValue),
                ErrorCode.DUPLICATE_RESOURCE);
    }

    public DuplicateResourceException(String message) {
        super(message, ErrorCode.DUPLICATE_RESOURCE);
    }
}
