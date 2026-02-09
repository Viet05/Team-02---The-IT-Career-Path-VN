package com.team02.backend.specification;

import com.team02.backend.entity.JobPosting;
import com.team02.backend.entity.JobSkill;
import com.team02.backend.enums.JobLevel;
import com.team02.backend.enums.JobType;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class JobPostingSpecification {

    public static Specification<JobPosting> getJobPostingSpecification(
            String keyword,
            String location,
            JobType jobType,
            JobLevel jobLevel,
            Long skillId,
            Double minSalary,
            Double maxSalary
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.toLowerCase() + "%";

                Predicate titlePredicate =
                        cb.like(cb.lower(root.get("title")), pattern);

                Predicate companyPredicate =
                        cb.like(cb.lower(root.get("companyName")), pattern);

                predicates.add(cb.or(titlePredicate, companyPredicate));
            }

            if (location != null && !location.trim().isEmpty()) {
                predicates.add(
                        cb.like(cb.lower(root.get("location")),
                                "%" + location.toLowerCase() + "%")
                );
            }

            if (jobType != null) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }

            if (jobLevel != null) {
                predicates.add(cb.equal(root.get("jobLevel"), jobLevel));
            }

            if (minSalary != null) {
                predicates.add(
                        cb.greaterThanOrEqualTo(root.get("salaryMax"), minSalary)
                );
            }

            if (maxSalary != null) {
                predicates.add(
                        cb.lessThanOrEqualTo(root.get("salaryMin"), maxSalary)
                );
            }

            if (skillId != null) {

                Join<JobPosting, JobSkill> jobSkillJoin =
                        root.join("jobSkills");

                predicates.add(
                        cb.equal(jobSkillJoin.get("skill").get("skillId"), skillId)
                );

                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
