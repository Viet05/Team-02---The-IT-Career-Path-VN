package com.team02.backend.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChartDataResponse {

  List<String> label;
  List<Long> jobsCreated;
  List<Long> activeUsers;
}
