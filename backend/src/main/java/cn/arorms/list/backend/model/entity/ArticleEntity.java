package cn.arorms.list.backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
public class ArticleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    @Column(name = "content", nullable = false, columnDefinition = "LONGTEXT")
    private String content;
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime created_at;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updated_at;
    @Column(name = "view_count", nullable = false)
    private Integer view_count = 0;
    @Column(name = "author_id", nullable = false)
    private Long author_id;
    @Column(name = "category_id", nullable = false)
    private Long category_id;

    // Constructor
    public ArticleEntity() {}
    public ArticleEntity(String title, String content, Long author_id, Long category_id) {
        this.title = title;
        this.content = content;
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
        this.view_count = 0;
        this.author_id = author_id;
        this.category_id = category_id;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }
    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public Integer getView_count() {
        return view_count;
    }
    public void setView_count(Integer view_count) {
        this.view_count = view_count;
    }

    public Long getAuthor_id() {
        return author_id;
    }
    public void setAuthor_id(Long author_id) {
        this.author_id = author_id;
    }

    public Long getCategory_id() {
        return category_id;
    }
    public void setCategory_id(Long category_id) {
        this.category_id = category_id;
    }
}
