package cn.arorms.arlist.controller;


import cn.arorms.arlist.entity.TodoEntity;
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
    public List<TodoEntity> list() {
        return todoService.getAll();
    }

    @GetMapping("/{id}")
    public TodoEntity get(@PathVariable Integer id) {
        return todoService.getById(id);
    }

    @PostMapping
    public void add(@RequestBody TodoEntity todoEntity) {
        todoService.add(todoEntity);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Integer id, @RequestBody TodoEntity todoEntity) {
        todoEntity.setId(id);
        todoService.update(todoEntity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        todoService.delete(id);
    }
}
