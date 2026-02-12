package cn.arorms.list.backend.pojos.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}
