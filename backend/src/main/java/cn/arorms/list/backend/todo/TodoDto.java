package cn.arorms.list.backend.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@Builder
public class TodoDto {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private Boolean completed = false;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;
    private Boolean scheduled;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration; // Minutes
}
