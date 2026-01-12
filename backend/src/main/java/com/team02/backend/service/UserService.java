package com.team02.backend.service;

import com.team02.backend.dto.request.UserUpdateRequest;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.entity.Users;
import com.team02.backend.enums.UserStatus;
import com.team02.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;

    public List<UserAdminResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserAdminResponse(
                        user.getUserId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole(),
                        user.getStatus()
                ))
                .toList();
    }

    public UserAdminResponse updateUser(Long id,UserUpdateRequest request) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setUsername(request.getUsername());
        user.setRole(request.getRole());

        userRepository.save(user);
        return new UserAdminResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
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

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new IllegalArgumentException("User already blocked");
        }

        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        return new UserAdminResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.getStatus()
        );
    }
}
