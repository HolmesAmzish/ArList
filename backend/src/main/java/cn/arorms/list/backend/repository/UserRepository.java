package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.pojo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository
 * @version 1.0 2025-07-04
 * @author Cacciatore
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
