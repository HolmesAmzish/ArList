package cn.arorms.list.backend.controllers;

import cn.arorms.list.backend.pojos.entities.Todo;
import cn.arorms.list.backend.services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
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
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "groupId", required = false) Long groupId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long userId = jwt.getClaim("user_id");
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return todoService.getAllByUserId(pageable, userId, groupId);
    }

    // Get an entity detail by ID
    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // Add a new entity
    @PostMapping("/add")
    public ResponseEntity<Todo> addTodo(@AuthenticationPrincipal Jwt jwt, @RequestBody Todo todo) {
        Long userId = jwt.getClaim("user_id");
        return ResponseEntity.ok(todoService.addTodo(userId, todo));
    }

    // Toggle completion status of an entity
    @PutMapping("/toggleComplete/{id}")
    public ResponseEntity<Todo> toggleCompleteTodo(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        Long userId = jwt.getClaim("user_id");
        return ResponseEntity.ok(todoService.toggleCompleted(userId, id));
    }


    // Modify
    @PutMapping()
    public ResponseEntity<Todo> updateTodo(@AuthenticationPrincipal Jwt jwt, @RequestBody Todo todo) {
        Long userId = jwt.getClaim("user_id");
        return ResponseEntity.ok(todoService.updateTodo(userId, todo));
    }

    // Delete an entity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@AuthenticationPrincipal Jwt jwt, @PathVariable Long id) {
        Long userId = jwt.getClaim("user_id");
        todoService.deleteTodo(userId, id);
        return ResponseEntity.ok().build();
    }
}
