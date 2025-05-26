package cn.arorms.arlist.mapper;

import cn.arorms.arlist.entity.TodoEntity;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TodoMapper {
    List<TodoEntity> findAll();
    List<TodoEntity> findAllByUserId(Long userId);
    TodoEntity findByTodoId(Integer todoId);
    int insert(TodoEntity todoEntity);
    int update(TodoEntity todoEntity);
    int delete(Integer id);
}