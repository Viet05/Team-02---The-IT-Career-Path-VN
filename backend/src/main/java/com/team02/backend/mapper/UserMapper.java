package com.team02.backend.mapper;

import com.team02.backend.dto.request.RegisterRequest;
import com.team02.backend.entity.Users;
import org.mapstruct.Mapper;

@Mapper
public interface UserMapper {

  Users registerMapper(RegisterRequest request);
}
