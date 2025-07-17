package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.dto.TodoDto;
import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.model.entity.UserEntity;
import cn.arorms.list.backend.repository.TodoRepository;
import cn.arorms.list.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * TodoService
 * @version 1.3 2025-07-16
 * @author Cacciatore
 */
@Service
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    public TodoDto getTodoById(Long id) {
        TodoEntity todoInfo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        TodoDto todoDto = TodoDto.builder()
                .id(todoInfo.getId())
                .title(todoInfo.getTitle())
                .description(todoInfo.getDescription())
                .dueDate(todoInfo.getDueDate())
                .completed(todoInfo.getCompleted())
                .scheduled(todoInfo.getScheduled())
                .userId(todoInfo.getUser().getId())
                .build();
        return todoDto;
    }

    public Page<TodoEntity> getAllTodos(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }

    public void addTodo(Long userId, TodoEntity todoInfo) {
        Optional<UserEntity> userOptional = userRepository.findById(userId);
        UserEntity user = userOptional.orElseThrow(() -> new RuntimeException("User not found with ID:" + userId));
        todoInfo.setUser(user);

        todoRepository.save(todoInfo);
    }

    public void modifyTodo(TodoDto todo) {
        Optional<TodoEntity> existingTodoOptional = todoRepository.findById(todo.getId());
        TodoEntity existingTodo = existingTodoOptional
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + todo.getId()));
        existingTodo.setTitle(todo.getTitle());
        existingTodo.setDescription(todo.getDescription());
        existingTodo.setCompleted(todo.getCompleted());
        existingTodo.setDueDate(todo.getDueDate());
        existingTodo.setScheduled(todo.getScheduled());
        todoRepository.save(existingTodo);
    }

    public void deleteTodo(Long id) {
        Optional<TodoEntity> todoOptinal = todoRepository.findById(id);
        TodoEntity todo = todoOptinal.orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        todoRepository.delete(todo);
    }
}
