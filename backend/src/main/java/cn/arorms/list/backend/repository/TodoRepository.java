package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.pojo.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    // Additional query methods can be defined here if needed
}
