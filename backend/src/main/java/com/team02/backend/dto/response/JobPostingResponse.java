package com.team02.backend.dto.response;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
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