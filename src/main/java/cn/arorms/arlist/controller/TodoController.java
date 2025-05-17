package cn.arorms.arlist.controller;


import cn.arorms.arlist.entity.Todo;
import cn.arorms.arlist.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public List<Todo> list() {
        return todoService.getAll();
    }

    @GetMapping("/{id}")
    public Todo get(@PathVariable Integer id) {
        return todoService.getById(id);
    }

    @PostMapping
    public void add(@RequestBody Todo todo) {
        todoService.add(todo);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Integer id, @RequestBody Todo todo) {
        todo.setId(id);
        todoService.update(todo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        todoService.delete(id);
    }
}
