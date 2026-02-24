package com.team02.backend.controller;

import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.dto.response.RecommendedJobResponse;
import com.team02.backend.security.CustomUserDetail;
import com.team02.backend.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.List;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/it-path/users/recommendations")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Validated
@Tag(name = "Job Recommendations", description = "API gợi ý việc làm phù hợp với hồ sơ người dùng")
@SecurityRequirement(name = "bearerAuth")
public class RecommendationController {

    RecommendationService recommendationService;

    @GetMapping
    @Operation(summary = "Gợi ý việc làm", description = "Trả về danh sách việc làm phù hợp nhất dựa trên kỹ năng, cấp độ, mục tiêu nghề nghiệp và địa điểm của người dùng hiện tại")
    public ApiResponse<List<RecommendedJobResponse>> getRecommendations(
            Authentication authentication,
            @Parameter(description = "Số lượng việc làm muốn gợi ý (1–50), mặc định 10") @RequestParam(defaultValue = "10") @Min(value = 1, message = "topN must be at least 1") @Max(value = 50, message = "topN must be at most 50") int topN) {
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        Long userId = userDetail.getId();

        List<RecommendedJobResponse> recommendations = recommendationService.getRecommendedJobResponses(userId, topN);

        return ApiResponse.<List<RecommendedJobResponse>>builder()
                .code(200)
                .message("Get job recommendations successfully")
                .data(recommendations)
                .build();
    }
}
