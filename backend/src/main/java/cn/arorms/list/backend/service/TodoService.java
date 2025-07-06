package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * TodoService
 * @version 1.1 2025-07-06
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

    public List<TodoEntity> getAllTodos() {
        return todoRepository.findAll();
    }

    public void addTodo(TodoEntity todo) {
        LocalDate currentDate = java.time.LocalDate.now();
        todo.setCreatedAt(currentDate);
        if(todo.getDueDate() == null) {
            todo.setDueDate(currentDate.plusDays(1)); // Default to 1 day from now
        }
        todoRepository.save(todo);
    }
}
