package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.model.entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    // Additional query methods can be defined here if needed
}
