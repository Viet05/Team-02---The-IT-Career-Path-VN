package com.team02.backend.exception;

import com.team02.backend.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
      ResourceNotFoundException ex,
      HttpServletRequest request) {
    return handleApplicationException(ex, request);
  }

  @ExceptionHandler(DuplicateResourceException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
      DuplicateResourceException ex,
      HttpServletRequest request) {
    return handleApplicationException(ex, request);
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorizedException(
      UnauthorizedException ex,
      HttpServletRequest request) {
    return handleApplicationException(ex, request);
  }

  @ExceptionHandler(ValidationException.class)
  public ResponseEntity<ErrorResponse> handleValidationException(
      ValidationException ex,
      HttpServletRequest request) {

    log.warn("Validation error: {}", ex.getMessage());

    ErrorResponse errorResponse = buildErrorResponse(
      ex,
      request,
      null,
      ex.getViolations());

    return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(EmailServiceException.class)
  public ResponseEntity<ErrorResponse> handleEmailServiceException(
      EmailServiceException ex,
      HttpServletRequest request) {

    log.error("Email service error: {}", ex.getMessage(), ex);

    ErrorResponse errorResponse = buildErrorResponse(
      ex,
      request,
      "Email service is temporarily unavailable",
      null);

    return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(FileProcessingException.class)
  public ResponseEntity<ErrorResponse> handleFileProcessingException(
      FileProcessingException ex,
      HttpServletRequest request) {

    log.warn("File processing error: {}", ex.getMessage());

    ErrorResponse errorResponse = buildErrorResponse(
      ex,
      request,
      "Please check your file format and try again",
      null);

    return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException ex,
      HttpServletRequest request) {

    log.warn("Validation failed: {}", ex.getMessage());

    Map<String, String> violations = new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(error ->
        violations.put(error.getField(), error.getDefaultMessage()));

    ErrorResponse errorResponse = buildErrorResponse(
      ErrorCode.VALIDATION_ERROR,
      null,
      request,
      null,
      violations);

    return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleAccessDeniedException(
      AccessDeniedException ex,
      HttpServletRequest request) {

    log.warn("Access denied: {}", ex.getMessage());

    ErrorResponse errorResponse = buildErrorResponse(
      ErrorCode.ACCESS_DENIED,
      null,
      request,
      null,
      null);

    return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
      IllegalArgumentException ex,
      HttpServletRequest request) {

    log.warn("Illegal argument: {}", ex.getMessage());

    ErrorResponse errorResponse = buildErrorResponse(
      ErrorCode.INVALID_ARGUMENT,
      ex.getMessage(),
      request,
      null,
      null);

    return ResponseEntity.status(ErrorCode.INVALID_ARGUMENT.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(ApplicationException.class)
  public ResponseEntity<ErrorResponse> handleApplicationException(
      ApplicationException ex,
      HttpServletRequest request) {

    log.warn("Application error: {}", ex.getMessage());

    ErrorResponse errorResponse = buildErrorResponse(ex, request, null, null);

    return ResponseEntity.status(ex.getHttpStatus()).body(errorResponse);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGenericException(
      Exception ex,
      HttpServletRequest request) {

    log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

    ErrorResponse errorResponse = buildErrorResponse(
      ErrorCode.INTERNAL_SERVER_ERROR,
      null,
      request,
      ex.getMessage(),
      null);

    return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getHttpStatus()).body(errorResponse);
  }

  private ErrorResponse buildErrorResponse(
      ApplicationException ex,
      HttpServletRequest request,
      String details,
      Map<String, String> violations) {

    ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
        .status(ex.getHttpStatus().value())
        .error(ex.getHttpStatus().getReasonPhrase())
        .errorCode(ex.getErrorCode())
        .message(ex.getMessage())
        .timestamp(LocalDateTime.now())
        .path(request.getRequestURI());

    if (details != null && !details.isBlank()) {
      builder.details(details);
    }

    if (violations != null && !violations.isEmpty()) {
      builder.violations(violations);
    }

    return builder.build();
  }

  private ErrorResponse buildErrorResponse(
      ErrorCode errorCode,
      String message,
      HttpServletRequest request,
      String details,
      Map<String, String> violations) {

    ErrorResponse.ErrorResponseBuilder builder = ErrorResponse.builder()
        .status(errorCode.getHttpStatus().value())
        .error(errorCode.getHttpStatus().getReasonPhrase())
        .errorCode(errorCode.getCode())
        .message(message == null || message.isBlank() ? errorCode.getDefaultMessage() : message)
        .timestamp(LocalDateTime.now())
        .path(request.getRequestURI());

    if (details != null && !details.isBlank()) {
      builder.details(details);
    }

    if (violations != null && !violations.isEmpty()) {
      builder.violations(violations);
    }

    return builder.build();
  }
}
