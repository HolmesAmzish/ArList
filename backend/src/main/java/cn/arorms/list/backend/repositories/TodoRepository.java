package cn.arorms.list.backend.repositories;

import cn.arorms.list.backend.pojos.entities.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Page<Todo> findByCreatedBy(String username, Pageable sortedPageable);
    Page<Todo> findByCreatedByAndGroup_Id(String username, Long groupId, Pageable sortedPageable);

    Boolean existsByIdAndCreatedBy(Long id, String username);
    Optional<Todo> findByIdAndCreatedBy(Long id, String username);

    Page<Todo> findAllByDeadlineIsNotNull(Pageable pageable);
}
