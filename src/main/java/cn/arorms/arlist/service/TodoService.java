package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.Todo;

import java.util.List;

public interface TodoService {
    List<Todo> getAll();
    Todo getById(Integer id);
    void add(Todo todo);
    void update(Todo todo);
    void delete(Integer id);
}
