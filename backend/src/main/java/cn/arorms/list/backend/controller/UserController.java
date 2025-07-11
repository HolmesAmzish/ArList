package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.model.entity.UserEntity;
import cn.arorms.list.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public UserEntity getByUsername(@PathVariable String username) {
        return userService.getByUsername(username);
    }
}
