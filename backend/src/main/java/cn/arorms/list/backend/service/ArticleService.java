package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.ArticleEntity;
import cn.arorms.list.backend.repository.ArticleRepository;
import org.springframework.stereotype.Service;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;
    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public ArticleEntity getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with ID:" + id));
    }
}
