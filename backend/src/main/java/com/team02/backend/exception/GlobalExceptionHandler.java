package com.team02.backend.exception;

import com.team02.backend.dto.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(value = Exception.class)
  public ResponseEntity<ApiResponse> exceptionHandler(final Exception e) {

    ApiResponse apiResponse = new ApiResponse();
    apiResponse.setMessage(e.getMessage());
    return ResponseEntity.badRequest().body(apiResponse);
  }
}
