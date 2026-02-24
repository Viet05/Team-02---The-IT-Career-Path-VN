package com.team02.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendationRequest {

    @Min(value = 1, message = "topN must be at least 1")
    @Max(value = 50, message = "topN must be at most 50")
    @Builder.Default
    private int topN = 10;
}
