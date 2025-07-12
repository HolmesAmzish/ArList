package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.repository.TodoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * TodoService
 * @version 1.2 2025-07-12
 * @author Cacciatore
 */
@Service
public class TodoService {
    private final TodoRepository todoRepository;
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public TodoEntity getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
    }

    public Page<TodoEntity> getAllTodos(Pageable pageable) {
        return todoRepository.findAll(pageable);
    }

    public void addTodo(TodoEntity todo) {
        LocalDate currentDate = java.time.LocalDate.now();
        todo.setCreatedAt(currentDate);
        if(todo.getDueDate() == null) {
            todo.setDueDate(currentDate.plusDays(1)); // Default to 1 day from now
        }
        todoRepository.save(todo);
    }

    public void modifyTodo(TodoEntity todo) {
        TodoEntity existingTodo = getTodoById(todo.getId());
        existingTodo.setTitle(todo.getTitle());
        existingTodo.setDescription(todo.getDescription());
        existingTodo.setCompleted(todo.getCompleted());
        existingTodo.setDueDate(todo.getDueDate());
        existingTodo.setIsMyDays(todo.getIsMyDays());
        todoRepository.save(existingTodo);
    }

    public void deleteTodo(Long id) {
        TodoEntity todo = getTodoById(id);
        todoRepository.delete(todo);
    }
}
