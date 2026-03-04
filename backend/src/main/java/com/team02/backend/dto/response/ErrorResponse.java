package com.team02.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String error;
    private String errorCode;
    private String message;
    private String details;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> violations;
}
