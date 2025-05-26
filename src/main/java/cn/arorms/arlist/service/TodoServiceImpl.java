package cn.arorms.arlist.service;

import cn.arorms.arlist.entity.TodoEntity;
import cn.arorms.arlist.mapper.TodoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoServiceImpl implements TodoService {

    @Autowired
    private TodoMapper todoMapper;

    @Override
    public List<TodoEntity> getAll() {
        return todoMapper.findAll();
    }

    @Override
    public List<TodoEntity> getUserTodos(Long userId) {
        return todoMapper.findAllByUserId(userId);
    }

    @Override
    public TodoEntity getById(Integer id) {
        return todoMapper.findByTodoId(id);
    }

    @Override
    public void add(TodoEntity todoEntity) {
        todoMapper.insert(todoEntity);
    }

    @Override
    public void update(TodoEntity todoEntity) {
        todoMapper.update(todoEntity);
    }

    @Override
    public void delete(Integer id) {
        todoMapper.delete(id);
    }
}
