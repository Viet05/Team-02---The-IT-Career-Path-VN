package com.team02.backend.mapper;

import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.dto.response.UserAdminResponse;
import com.team02.backend.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

  Users registerMapper(RegisterRequest request);

  UserAdminResponse toUserAdminResponse(Users users);

  List<UserAdminResponse> toUserAdminResponses(List<Users> users);

}
