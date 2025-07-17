package cn.arorms.list.backend.todo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<TodoEntity, Long> {
    // Additional query methods can be defined here if needed
}
