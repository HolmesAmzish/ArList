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
        return todoService.getAllTodos(pageable);
    }
    // Get an entity detail by ID
    @GetMapping("/{id}")
    public Todo getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }



    // Add a new entity
    @PostMapping("/add")
    public void addTodo(@RequestBody Todo todo) {
        todoService.addTodo(todo);
    }

    // Toggle completion status of an entity
    @PostMapping("/toggleComplete/{id}")
    public void completeTodo(@PathVariable Long id) {
        Todo todo = todoService.getTodoById(id);
        todo.setIsCompleted(!todo.getIsCompleted());
        todoService.modifyTodo(todo);
    }

    // Delete an entity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/modify/{id}")
    public void modifyTodo(@RequestBody Todo todo) {
        todoService.modifyTodo(todo);
    }
}
