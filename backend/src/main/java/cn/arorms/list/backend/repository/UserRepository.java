package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository
 * @version 1.0 2025-07-04
 * @author Cacciatore
 */
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
}
