package cn.arorms.list.backend.repositories;

import cn.arorms.list.backend.pojos.entities.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Page<Todo> findByUser_Id(Long userId, Pageable sortedPageable);
    Page<Todo> findByUser_IdAndGroup_Id(Long userId, Long groupId, Pageable sortedPageable);

    Boolean existsByIdAndUser_Id(Long id, Long userId);
    Optional<Todo> findByIdAndUser_Id(Long id, Long userId);
}
