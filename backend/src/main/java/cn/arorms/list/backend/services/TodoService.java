package cn.arorms.list.backend.services;

import cn.arorms.list.backend.pojos.entities.Todo;
import cn.arorms.list.backend.repositories.GroupRepository;
import cn.arorms.list.backend.repositories.TodoRepository;
import cn.arorms.list.backend.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
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
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, GroupRepository groupRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public Page<Todo> getAllByUserId(Pageable pageable, Long userId, Long groupId) {
        Sort sort = Sort.by(Sort.Order.asc("isCompleted"),
                Sort.Order.desc("createdAt"));

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        if (groupId != null) {
            return todoRepository.findByUser_IdAndGroup_Id(userId, groupId, sortedPageable);
        }

        return todoRepository.findByUser_Id(userId, sortedPageable);
    }

    // Get by ID
    public Todo getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
    }

    // Create
    public Todo addTodo(Long userId, Todo todo) {
        todo.setUser(userRepository.getReferenceById(userId));
        if (todo.getGroup() != null && todo.getGroup().getId() != null) {
            todo.setGroup(groupRepository.getReferenceById(todo.getGroup().getId()));
        }
        return todoRepository.save(todo);
    }

    // Update
    public Todo updateTodo(Todo todo) {
        if (!todoRepository.existsById(todo.getId())) {
            throw new NoSuchElementException("Can not found existing todo.");
        }
        return todoRepository.save(todo);
    }

    // Toggle isCompleted
    public Todo toggleCompleted(Long id) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Can not found existing todo."));
        existingTodo.setIsCompleted(!existingTodo.getIsCompleted());
        return todoRepository.save(existingTodo);
    }

    // Delete
    public void deleteTodo(Long id) {
        Optional<Todo> todoOptinal = todoRepository.findById(id);
        Todo todo = todoOptinal.orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
        todoRepository.delete(todo);
    }
}
