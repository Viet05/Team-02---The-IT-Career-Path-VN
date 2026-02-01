package com.team02.backend.exception;

import com.team02.backend.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(value = Exception.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ApiResponse<?>> exceptionHandler(Exception e, WebRequest request) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .code(400)
        .message(e.getMessage() != null ? e.getMessage() : "An error occurred")
        .data(null)
        .build();
    return ResponseEntity.badRequest().body(apiResponse);
  }

  @ExceptionHandler(value = MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ApiResponse<?>> validationExceptionHandler(MethodArgumentNotValidException e, WebRequest request) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .code(400)
        .message("Validation failed")
        .data(e.getBindingResult().getAllErrors())
        .build();
    return ResponseEntity.badRequest().body(apiResponse);
  }

  @ExceptionHandler(value = IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<ApiResponse<?>> illegalArgumentExceptionHandler(IllegalArgumentException e, WebRequest request) {
    ApiResponse<?> apiResponse = ApiResponse.builder()
        .code(400)
        .message(e.getMessage())
        .data(null)
        .build();
    return ResponseEntity.badRequest().body(apiResponse);
  }
}
