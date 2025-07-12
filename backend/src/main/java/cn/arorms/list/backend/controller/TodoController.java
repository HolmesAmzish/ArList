package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TodoController
 * @version 1.0 2025-07-05
 * @author Cacciatore
 */
@RestController
@RequestMapping("/todo")
public class TodoController {
    private final TodoService todoService;
    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    // Get a todos detail by ID
    @GetMapping("/{id}")
    public TodoEntity getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // Get all todos with pagination
    @GetMapping("/all")
    public Page<TodoEntity> getAllTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return todoService.getAllTodos(pageable);
    }

    // Add a new todo
    @PostMapping("/add")
    public void addTodo(@RequestBody TodoEntity todo) {
        todoService.addTodo(todo);
    }

    // Toggle completion status of a todo
    @PostMapping("/toggleComplete/{id}")
    public void completeTodo(@PathVariable Long id) {
        TodoEntity todo = todoService.getTodoById(id);
        todo.setCompleted(!todo.getCompleted());
        todoService.modifyTodo(todo);
    }

    // Delete a todo
    @PostMapping("/delete/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    @PostMapping("/modify")
    public void modifyTodo(@RequestBody TodoEntity todo) {
        todoService.modifyTodo(todo);
    }
}
