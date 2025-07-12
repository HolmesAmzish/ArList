package cn.arorms.list.backend;

import cn.arorms.list.backend.security.TokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class EncoderTest {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenProvider tokenProvider;

    @Test
    void generateEncodedPassword() {
        String password = "123123";
        String encodedPassword = passwordEncoder.encode(password);
        System.out.printf("encodedPassword: %s\n", encodedPassword);
    }

    @Test
    void generateToken() {
        String username = "Cacciatore";
        String jsonWebToken = tokenProvider.generateToken(username);
        System.out.printf("generated token: %s\n", jsonWebToken);
    }
}
