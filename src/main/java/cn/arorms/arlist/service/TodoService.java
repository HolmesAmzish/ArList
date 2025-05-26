package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.TodoEntity;

import java.util.List;

public interface TodoService {
    List<TodoEntity> getAll();
    List<TodoEntity> getUserTodos(Long userId);
    TodoEntity getById(Integer id);
    void add(TodoEntity todoEntity);
    void update(TodoEntity todoEntity);
    void delete(Integer id);
}
