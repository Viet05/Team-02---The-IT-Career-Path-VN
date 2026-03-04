package com.team02.backend.exception;

public class FileProcessingException extends ApplicationException {

    public FileProcessingException(String message) {
        super(message, ErrorCode.FILE_PROCESSING_ERROR);
    }

    public FileProcessingException(String message, Throwable cause) {
        super(message, ErrorCode.FILE_PROCESSING_ERROR, cause);
    }
}
