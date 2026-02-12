package cn.arorms.list.backend.services;

import cn.arorms.list.backend.pojos.entities.Group;
import cn.arorms.list.backend.repositories.GroupRepository;
import cn.arorms.list.backend.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * GroupService
 * @version 1.0 2026-02-03
 * @author Cacciatore
 */
@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getAllByUserId(Long userId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "orderIndex");
        return groupRepository.findByUser_Id(userId, sort);
    }

    public Group addGroup(Long userId, Group group) {
        // Check group id to prevent update wrongly
        if (group.getId() != null) {
            throw new IllegalArgumentException("New group cannot have an ID!");
        }

        // Set user
        group.setUser(userRepository.getReferenceById(userId));

        // Set group order index for ui
        int count = groupRepository.countByUser_Id(userId);
        group.setOrderIndex(count);

        return groupRepository.save(group);
    }

    public Group updateGroup(Long userId, Group group) {
        if (!groupRepository.existsById(group.getId())) {
            throw new NoSuchElementException("Can not found exsiting group");
        }
        group.setUser(userRepository.getReferenceById(userId));
        return groupRepository.save(group);
    }

    @Transactional
    public Group updateGroupOrder(Group group) {

        int originalOrderIndex = groupRepository.findById(group.getId())
                .map(Group::getOrderIndex)
                .orElseThrow(() -> new NoSuchElementException("Can not found exsiting group with id: " + group.getId()));

        int changedOrderIndex = group.getOrderIndex();

        // Shift related group order index before update the target group.
        if (originalOrderIndex < changedOrderIndex) {
            groupRepository.shiftBackward(originalOrderIndex + 1, changedOrderIndex);
        } else {
            groupRepository.shiftForward(changedOrderIndex, originalOrderIndex - 1);
        }


        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        Optional<Group> groupOptional = groupRepository.findById(id);
        Group group = groupOptional.orElseThrow(() -> new RuntimeException("Group not found with ID: " + id));
        groupRepository.delete(group);
    }
}
