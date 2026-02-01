package com.team02.backend.dto.response;

import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

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
    private JobType jobType;
    private JobLevel jobLevel;
}