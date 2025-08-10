package cn.arorms.list.backend.todo;

import cn.arorms.list.backend.user.UserEntity;
import cn.arorms.list.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * TodoService
 * @version 1.3 2025-07-16
 * @author Cacciatore
 */
@Service
public class TodoService {
    private static final Logger log = LoggerFactory.getLogger(TodoService.class);
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    // Get all
    public Page<TodoDto> getAllTodos(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return todoRepository.findAll(sortedPageable).map(TodoDto::new);
    }

    // Get by ID
    public TodoDto getTodoById(Long id) {
        var todoEntity = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        return new TodoDto(todoEntity);
    }

    // Create
    public void addTodo(Long userId, TodoEntity todoInfo) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        UserEntity user = userOptional.orElseThrow(() -> new RuntimeException("User not found with ID:" + userId));
        todoInfo.setUser(user);

        todoRepository.save(todoInfo);
    }

    // Update
    public void modifyTodo(TodoDto todo) {
        Optional<TodoEntity> existingTodoOptional = todoRepository.findById(todo.getId());
        log.info("Todo modification request: {}", todo);
        TodoEntity existingTodo = existingTodoOptional
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + todo.getId()));
        existingTodo.setTitle(todo.getTitle());
        existingTodo.setDescription(todo.getDescription());
        existingTodo.setCompleted(todo.getCompleted());
        existingTodo.setDueDate(todo.getDueDate());
        existingTodo.setScheduled(todo.getScheduled());
        existingTodo.setStartTime(todo.getStartTime());
        existingTodo.setEndTime(todo.getEndTime());
        existingTodo.setDuration(todo.getDuration());
        todoRepository.save(existingTodo);
    }

    // Delete
    public void deleteTodo(Long id) {
        Optional<TodoEntity> todoOptinal = todoRepository.findById(id);
        TodoEntity todo = todoOptinal.orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        todoRepository.delete(todo);
    }
}
