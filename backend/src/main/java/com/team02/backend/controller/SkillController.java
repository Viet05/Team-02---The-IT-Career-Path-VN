package com.team02.backend.controller;

import com.team02.backend.dto.request.SkillAddRequest;
import com.team02.backend.dto.request.SkillUpdateRequest;
import com.team02.backend.dto.response.ApiResponse;
import com.team02.backend.service.SkillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/it-path/admin/skills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SkillController {

    SkillService skillService;

    @GetMapping()
    public ApiResponse<Object> getSkills() {
        return ApiResponse.builder()
                .code(200)
                .message("Get skills successfully")
                .data(skillService.getSkills())
                .build();
    }

    @PostMapping()
    public ApiResponse<Object> addSkill(@RequestBody SkillAddRequest request) {
        return ApiResponse.builder()
                .code(200)
                .message("Add skill successfully")
                .data(skillService.addSkill(request))
                .build();
    }

    @PutMapping("/{skillId}")
    public ApiResponse<Object> updateSkill(@PathVariable Long skillId,
                                           @RequestBody SkillUpdateRequest request) {
        return ApiResponse.builder()
                .code(200)
                .message("Update skill successfully")
                .data(skillService.updateSkill(request, skillId))
                .build();
    }

    @DeleteMapping("/{skillId}")
    public ApiResponse<Object> deleteSkill(@PathVariable Long skillId) {
        skillService.deleteSkill(skillId);
        return ApiResponse.builder()
                .code(200)
                .message("Delete skill successfully")
                .build();
    }
}
