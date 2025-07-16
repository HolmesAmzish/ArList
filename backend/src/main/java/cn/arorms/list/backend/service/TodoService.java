package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.model.entity.UserEntity;
import cn.arorms.list.backend.repository.TodoRepository;
import cn.arorms.list.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    public TodoEntity getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
    }

    public Page<TodoEntity> getAllTodos(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }

    public void addTodo(Long userId, TodoEntity todoInfo) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID:" + userId));
        todoInfo.setUser(user);

        todoRepository.save(todoInfo);
    }

    public void modifyTodo(TodoEntity todo) {
        TodoEntity existingTodo = getTodoById(todo.getId());
        existingTodo.setTitle(todo.getTitle());
        existingTodo.setDescription(todo.getDescription());
        existingTodo.setCompleted(todo.getCompleted());
        existingTodo.setDueDate(todo.getDueDate());
        existingTodo.setScheduled(todo.getScheduled());
        todoRepository.save(existingTodo);
    }

    public void deleteTodo(Long id) {
        TodoEntity todo = getTodoById(id);
        todoRepository.delete(todo);
    }
}
