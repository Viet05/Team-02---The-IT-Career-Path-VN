package com.team02.backend.dto.response;
import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class JobPostingResponse {
    private Long jobPostingId;
    private String title;
    private String companyName;
    private String salaryText; // canh tranh hoac 10-15 trieu VND
    private String location;
    private LocalDateTime postedAt;
    private String jobUrl;
    private String jobSourceName;
}