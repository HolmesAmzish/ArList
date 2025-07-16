package cn.arorms.list.backend.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class NewTodoDto {
    private Long userId;
    private String title;
    private String description;
    private Boolean completed = false;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
}
