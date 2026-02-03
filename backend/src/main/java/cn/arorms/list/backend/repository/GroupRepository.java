package cn.arorms.list.backend.repository;

import cn.arorms.list.backend.pojo.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Modifying
    @Query("UPDATE Group g SET g.orderIndex = g.orderIndex + 1 " +
            "WHERE g.orderIndex >= :start AND g.orderIndex <= :end")
    void shiftForward(int start, int end);

    @Modifying
    @Query("UPDATE Group g SET g.orderIndex = g.orderIndex - 1 " +
            "WHERE g.orderIndex >= :start AND g.orderIndex <= :end")
    void shiftBackward(int start, int end);
}
