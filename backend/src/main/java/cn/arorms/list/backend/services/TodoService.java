package cn.arorms.list.backend.services;

import cn.arorms.list.backend.pojos.entities.Todo;
import cn.arorms.list.backend.repositories.GroupRepository;
import cn.arorms.list.backend.repositories.TodoRepository;
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
 * @version 2.0 2026-03-24
 * @author Cacciatore
 */
@Service
public class TodoService {
    private static final Logger log = LoggerFactory.getLogger(TodoService.class);
    private final TodoRepository todoRepository;
    private final GroupRepository groupRepository;

    public TodoService(TodoRepository todoRepository, GroupRepository groupRepository) {
        this.todoRepository = todoRepository;
        this.groupRepository = groupRepository;
    }

    public Page<Todo> getAllByUsername(Pageable pageable, String username, Long groupId) {
        Sort sort = Sort.by(Sort.Order.asc("isCompleted"),
                Sort.Order.desc("createdAt"));

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );

        if (groupId != null) {
            return todoRepository.findByCreatedByAndGroup_Id(username, groupId, sortedPageable);
        }

        return todoRepository.findByCreatedBy(username, sortedPageable);
    }

    public Page<Todo> getAllByDeadline(Pageable pageable, String username) {
        Sort sort = Sort.by(Sort.Order.desc("deadline"),
                Sort.Order.desc("createdAt"));
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort
        );
        return todoRepository.findAllByDeadlineIsNotNull(pageable);
    }

    // Get by ID
    public Todo getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with ID:" + id));
    }

    // Create
    public Todo addTodo(String username, Todo todo) {
        todo.setCreatedBy(username);
        if (todo.getGroup() != null && todo.getGroup().getId() != null) {
            todo.setGroup(groupRepository.getReferenceById(todo.getGroup().getId()));
        }
        return todoRepository.save(todo);
    }

    // Toggle isCompleted
    public Todo toggleCompleted(String username, Long id) {
        Todo existingTodo = todoRepository.findByIdAndCreatedBy(id, username)
                .orElseThrow(() -> new NoSuchElementException("Can not found existing todo."));
        existingTodo.setIsCompleted(!existingTodo.getIsCompleted());
        return todoRepository.save(existingTodo);
    }

    // Modify
    public Todo updateTodo(String username, Todo todo) {
        if (!todoRepository.existsByIdAndCreatedBy(todo.getId(), username)) {
            throw new NoSuchElementException("Can not found existing todo.");
        }
        todo.setCreatedBy(username);
        return todoRepository.save(todo);
    }

    // Delete
    public void deleteTodo(String username, Long id) {
        Todo existingTodo = todoRepository.findByIdAndCreatedBy(id, username)
                .orElseThrow(() -> new NoSuchElementException("Can not found existing todo."));
        todoRepository.delete(existingTodo);
    }
}
