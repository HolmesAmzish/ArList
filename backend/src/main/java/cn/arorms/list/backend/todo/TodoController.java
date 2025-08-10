package cn.arorms.list.backend.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

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

    // Get an entity detail by ID
    @GetMapping("/{id}")
    public TodoDto getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // Get all todos with pagination
    @GetMapping("/all")
    public Page<TodoDto> getAllTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        return todoService.getAllTodos(pageable);
    }

    // Add a new entity
    @PostMapping("/add")
    public void addTodo(@RequestBody TodoDto newTodo) {
        TodoEntity todoInfo = TodoEntity.builder()
                .title(newTodo.getTitle())
                .description(newTodo.getDescription())
                .dueDate(newTodo.getDueDate())
                .completed(false) // Default to not completed
                .build();
        todoService.addTodo(newTodo.getUserId(), todoInfo);
    }

    // Toggle completion status of an entity
    @PostMapping("/toggleComplete/{id}")
    public void completeTodo(@PathVariable Long id) {
        TodoDto todo = todoService.getTodoById(id);
        TodoDto updatedTodo = new TodoDto();
        updatedTodo.setId(todo.getId());
        updatedTodo.setTitle(todo.getTitle());
        updatedTodo.setDescription(todo.getDescription());
        updatedTodo.setDueDate(todo.getDueDate());
        updatedTodo.setScheduled(todo.getScheduled());
        updatedTodo.setCompleted(!todo.getCompleted());
        todoService.modifyTodo(updatedTodo);
    }

    // Delete an entity
    @PostMapping("/delete/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    @PostMapping("/modify/{id}")
    public void modifyTodo(@RequestBody TodoDto todo) {
        todoService.modifyTodo(todo);
    }
}
