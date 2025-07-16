package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.UserEntity;
import cn.arorms.list.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class SeedDataService implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SeedDataService.class);
    private final UserRepository userRepository;

    public SeedDataService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (userRepository.count() == 0) {
            // Initialize with default users
            UserEntity defualtAdmin = UserEntity.builder()
                    .username("Cacciatore")
                    .password("20230612")
                    .email("cacc@mail.arorms.cn")
                    .build();
            userRepository.save(defualtAdmin);
            log.info("Default admin user created: {}", defualtAdmin.getUsername());
        }
    }
}
