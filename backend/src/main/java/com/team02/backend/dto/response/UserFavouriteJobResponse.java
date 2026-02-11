package com.team02.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFavouriteJobResponse {
    private Long userFavouriteJobId;
    private Long jobPostingId;
    private Long userId;
}
