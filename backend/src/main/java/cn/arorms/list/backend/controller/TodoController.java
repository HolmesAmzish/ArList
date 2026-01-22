package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.pojo.entity.Todo;
import cn.arorms.list.backend.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * TodoController
 * @version 1.0 2025-07-05
 * @author Cacciatore
 */
@RestController
@RequestMapping("/api/todo")
public class TodoController {
    private final TodoService todoService;
    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    // Get all todos with pagination
    @GetMapping()
    public Page<Todo> getAllTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return todoService.getTodos(pageable);
    }

    // Get an entity detail by ID
    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // Add a new entity
    @PostMapping("/add")
    public ResponseEntity<Todo> addTodo(@RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.addTodo(todo));
    }

    // Toggle completion status of an entity
    @PutMapping("/toggleComplete/{id}")
    public ResponseEntity<Todo> toggleCompleteTodo(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.toggleCompleted(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> modifyTodo(@RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.updateTodo(todo));
    }

    // Delete an entity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
}
