package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.UserEntity;

public interface UserService {
    UserEntity findByUsername(String username);
    int insertUser(UserEntity user);
    boolean usernameExists(String username);
}
