package cn.arorms.list.backend.services;

import cn.arorms.list.backend.pojos.entities.Group;
import cn.arorms.list.backend.repositories.GroupRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * GroupService
 * @version 2.0 2026-03-24
 * @author Cacciatore
 */
@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getAllByUsername(String username) {
        Sort sort = Sort.by(Sort.Direction.DESC, "orderIndex");
        return groupRepository.findByCreatedBy(username, sort);
    }

    public Group addGroup(String username, Group group) {
        // Check group id to prevent update wrongly
        if (group.getId() != null) {
            throw new IllegalArgumentException("New group cannot have an ID!");
        }

        // Set user
        group.setCreatedBy(username);

        // Set group order index for ui
        int count = groupRepository.countByCreatedBy(username);
        group.setOrderIndex(count);

        return groupRepository.save(group);
    }

    public Group updateGroup(String username, Group group) {
        if (!groupRepository.existsById(group.getId())) {
            throw new NoSuchElementException("Can not found exsiting group");
        }
        group.setCreatedBy(username);
        return groupRepository.save(group);
    }

    @Transactional
    public Group updateGroupOrder(String username, Group group) {

        int originalOrderIndex = groupRepository.findById(group.getId())
                .map(Group::getOrderIndex)
                .orElseThrow(() -> new NoSuchElementException("Can not found exsiting group with id: " + group.getId()));

        int changedOrderIndex = group.getOrderIndex();

        // Shift related group order index before update the target group.
        if (originalOrderIndex < changedOrderIndex) {
            groupRepository.shiftBackward(originalOrderIndex + 1, changedOrderIndex, username);
        } else {
            groupRepository.shiftForward(changedOrderIndex, originalOrderIndex - 1, username);
        }


        return groupRepository.save(group);
    }

    public void deleteGroup(Long id) {
        Optional<Group> groupOptional = groupRepository.findById(id);
        Group group = groupOptional.orElseThrow(() -> new RuntimeException("Group not found with ID: " + id));
        groupRepository.delete(group);
    }
}
