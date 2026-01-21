package cn.arorms.list.backend.service;

import cn.arorms.list.backend.pojo.entity.Group;
import cn.arorms.list.backend.pojo.entity.Todo;
import cn.arorms.list.backend.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;
    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group addGroup(Group group) {
        group.setId(null);  // Increase in database
        return groupRepository.save(group);
    }

    public Group updateGroup(Group group) {
//        Group existingGroup = groupRepository.findById(id)
//                .orElseThrow(() -> new NoSuchElementException("Group not found with id: " + id));
        if (!groupRepository.existsById(group.getId())) {
            throw new NoSuchElementException("Can not found exsiting group");
        }
        return groupRepository.save(group);
    }

//    public void deleteGroup(Long id) {
//        Optional<Group> groupOptional = groupRepository.findById(id);
//        Group group = groupOptional.orElseThrow(() -> new RuntimeException("Group not found"));
//        groupRepository.delete(group);
//    }
}
