package com.team02.backend.service;

import com.team02.backend.dto.request.UserUpdateRequest;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserRole;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.mapper.UserMapper;
import com.team02.backend.repository.UserRepository;
import com.team02.backend.specification.UserSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;

    public List<UserAdminResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserAdminResponse(
                        user.getUserId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus(),
                        user.getCreatedAt(),
                        user.getUpdatedAt()
                ))
                .toList();
    }

    public UserAdminResponse updateUser(Long id, UserUpdateRequest request) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setUsername(request.getUsername());
        user.setRole(request.getRole());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return new UserAdminResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public void deleteUserById(Long id){
        if(!userRepository.existsById(id)){
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }

    public UserAdminResponse blockUser(Long id){
        Users user = userRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Toggle status: ACTIVE -> INACTIVE, INACTIVE -> ACTIVE
        if (user.getStatus() == UserStatus.INACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        } else {
            user.setStatus(UserStatus.INACTIVE);
        }
        
        userRepository.save(user);

        return new UserAdminResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public List<UserAdminResponse> searchAndFilterUsers(
            String keyword,
            UserStatus status,
            UserRole role
    ){
        Specification<Users> spec =
                UserSpecification.searchAndFilter(
                        keyword,
                        status,
                        role);

        List<Users> users = userRepository.findAll(spec);

        return userMapper.toUserAdminResponses(users);
    }
}
