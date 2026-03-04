package com.team02.backend.specification;

import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

public class UserSpecification {

    public static Specification<Users> searchAndFilter(
            String keyword,
            UserStatus status,
            UserRole role
    ){
        return (root, query, cb) ->{
            List<Predicate> predicates = new ArrayList<>();

            // search username or email
            if(keyword != null &&  !keyword.trim().isEmpty()){
                String pattern = "%"+keyword.toLowerCase()+"%";

                Predicate usernameNeeded =
                        cb.like(cb.lower(root.get("username")), pattern);

                Predicate emailNeeded =
                        cb.like(cb.lower(root.get("email")), pattern);


                predicates.add(cb.or(usernameNeeded, emailNeeded));
            }

            // Filter role, status
            if(status != null){
                predicates.add(cb.equal(root.get("status"), status));
            }

            if(role != null){
                predicates.add(cb.equal(root.get("role"), role));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

    }
}
