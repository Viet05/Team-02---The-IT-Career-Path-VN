package com.team02.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobImportDTO {

    private String companyName;
    private String description;
    private String externalJobId;
    private JobLevel jobLevel;
    private JobType jobType;
    private String jobUrl;
    private String location;
    private LocalDateTime postedAt;
    private Double salaryMin;
    private Double salaryMax;
    private String salaryText;
    private String title;
    private Long jobSourceId;
}
