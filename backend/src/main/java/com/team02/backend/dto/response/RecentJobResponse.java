package com.team02.backend.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecentJobResponse {

    Long jobPostingId;
    String title;
    String companyName;
    String location;
    LocalDateTime postedAt;
}
