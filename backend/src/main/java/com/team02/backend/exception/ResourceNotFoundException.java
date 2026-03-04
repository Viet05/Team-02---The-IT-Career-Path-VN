package com.team02.backend.exception;

public class ResourceNotFoundException extends ApplicationException {

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(
                String.format("%s not found with id: %s", resourceName, identifier),
                ErrorCode.RESOURCE_NOT_FOUND);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(
                String.format("%s not found with %s: %s", resourceName, fieldName, fieldValue),
                ErrorCode.RESOURCE_NOT_FOUND);
    }

    public ResourceNotFoundException(String message) {
        super(message, ErrorCode.RESOURCE_NOT_FOUND);
    }
}
