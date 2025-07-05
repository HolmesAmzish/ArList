package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.model.entity.TodoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {
    // Additional query methods can be defined here if needed
}
