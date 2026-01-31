package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.pojo.entity.Group;
import cn.arorms.list.backend.pojo.entity.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Page<Todo> findByGroupId(Long groupId, Pageable sortedPageable);
    // Additional query methods can be defined here if needed
}
