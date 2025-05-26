package cn.arorms.arlist.mapper;

import cn.arorms.arlist.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    UserEntity findById(@Param("id") Long id);
    UserEntity findByUsername(@Param("username") String username);
    int insert(UserEntity user);
}
