package cn.arorms.list.backend.todo;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
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

    public TodoDto(TodoEntity entity) {
        this.id = entity.getId();
        this.userId = entity.getUser() != null ? entity.getUser().getId() : null;
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.completed = entity.getCompleted();
        this.createdAt = entity.getCreatedAt();
        this.dueDate = entity.getDueDate();
        this.scheduled = entity.getScheduled();
        this.startTime = entity.getStartTime();
        this.endTime = entity.getEndTime();
        this.duration = entity.getDuration();
    }
}
