package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.UserEntity;
import cn.arorms.arlist.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserEntity findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    public int insertUser(UserEntity user) {
        // 密码加密后再存入数据库
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.insert(user);
    }

    @Override
    public boolean usernameExists(String username) {
        return userMapper.findByUsername(username) != null;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userMapper.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String role = user.getIsAdmin() ? "ROLE_ADMIN" : "ROLE_USER";

        return User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singleton(new SimpleGrantedAuthority(role)))
                .build();
    }
}
