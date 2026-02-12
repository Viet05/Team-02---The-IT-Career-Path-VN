package com.team02.backend.service;

import com.team02.backend.dto.request.SkillAddRequest;
import com.team02.backend.dto.request.SkillUpdateRequest;
import com.team02.backend.dto.response.SkillResponse;
import com.team02.backend.entity.Skill;
import com.team02.backend.repository.SkillRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SkillService {

    SkillRepository skillRepository;

    public List<SkillResponse> getSkills() {
        return skillRepository.findAll()
                .stream()
                .map(skill -> new SkillResponse(
                        skill.getSkillId(),
                        skill.getName(),
                        skill.getDescription()
                )).toList();
    }

    public SkillResponse updateSkill(SkillUpdateRequest request, Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skillRepository.save(skill);
        return new SkillResponse(
                skill.getSkillId(),
                skill.getName(),
                skill.getDescription()
        );
    }

    public void deleteSkill(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        skillRepository.delete(skill);
    }

    public SkillResponse addSkill(SkillAddRequest request) {
        if (skillRepository.existsByName(request.getName())) {
            throw new RuntimeException("Skill name already exists");
        }

        Skill skill = Skill.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Skill saved = skillRepository.save(skill);
        return new SkillResponse(
                saved.getSkillId(),
                saved.getName(),
                saved.getDescription()
        );
    }
}
