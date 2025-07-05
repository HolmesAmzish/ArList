package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.model.entity.TodoEntity;
import cn.arorms.list.backend.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/{id}")
    public TodoEntity getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    @GetMapping("/all")
    public List<TodoEntity> getAllTodos() {
        return todoService.getAllTodos();
    }

    @PostMapping("/add")
    public void addTodo(@RequestBody TodoEntity todo) {
        todoService.addTodo(todo);
    }
}
