package cn.arorms.arlist.mapper;

import cn.arorms.arlist.entity.Todo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface TodoMapper {
    List<Todo> findAll();
    Todo findById(Integer id);
    int insert(Todo todo);
    int update(Todo todo);
    int delete(Integer id);
}