package cn.arorms.list.backend.repositories;

import cn.arorms.list.backend.pojos.entities.Group;
import cn.arorms.list.backend.pojos.entities.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByUser_Id(Long userId, Sort sort);

    @Modifying
    @Query("UPDATE Group g SET g.orderIndex = g.orderIndex + 1 " +
            "WHERE g.orderIndex >= :start AND g.orderIndex <= :end")
    void shiftForward(int start, int end);

    @Modifying
    @Query("UPDATE Group g SET g.orderIndex = g.orderIndex - 1 " +
            "WHERE g.orderIndex >= :start AND g.orderIndex <= :end")
    void shiftBackward(int start, int end);

    int countByUser_Id(Long userId);
}
