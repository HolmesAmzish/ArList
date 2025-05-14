package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.Todo;
import cn.arorms.arlist.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoMapper todoMapper;

    @Override
    public List<Todo> getAll() {
        return todoMapper.findAll();
    }

    @Override
    public Todo getById(Integer id) {
        return todoMapper.findById(id);
    }

    @Override
    public void add(Todo todo) {
        todoMapper.insert(todo);
    }

    @Override
    public void update(Todo todo) {
        todoMapper.update(todo);
    }

    @Override
    public void delete(Integer id) {
        todoMapper.delete(id);
    }
}
