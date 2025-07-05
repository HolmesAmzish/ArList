package cn.arorms.list.backend.service;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TodoService
 * @version 1.0 2025-07-05
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
        LocalDate
        if(todo.getDueDate() == null) {
            todo.setDueDate(java.time.LocalDate.now().plusDays(1)); // Default to 7 days from now
        }
        todoRepository.save(todo);
    }
}
