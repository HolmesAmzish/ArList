package cn.arorms.list.backend.service;

import cn.arorms.list.backend.pojo.entity.Todo;
import cn.arorms.list.backend.pojo.entity.User;
import cn.arorms.list.backend.repository.TodoRepository;
import cn.arorms.list.backend.repository.UserRepository;
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
    public Page<Todo> getAllTodos(Pageable pageable) {
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        return todoRepository.findAll(sortedPageable);
    }

    // Get by ID
    public Todo getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
    }

    // Create
    public void addTodo(Todo todoInfo) {
        todoRepository.save(todoInfo);
    }

    // Update
    public void modifyTodo(Todo todo) {
        todoRepository.save(todo);
    }

    // Delete
    public void deleteTodo(Long id) {
        Optional<Todo> todoOptinal = todoRepository.findById(id);
        Todo todo = todoOptinal.orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        todoRepository.delete(todo);
    }
}
