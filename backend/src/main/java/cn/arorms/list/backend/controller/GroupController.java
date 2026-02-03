package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.pojo.entity.Group;
import cn.arorms.list.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * GroupController
 * @version 1.0 2026-02-01
 * @author Cacciatore
 */
@RestController @RequestMapping("/api/group")
public class GroupController {
    @Autowired
    private GroupService groupService;
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    // Get all groups
    @GetMapping()
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    // Add a new group
    @PostMapping()
    public ResponseEntity<Group> addGroup(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.addGroup(group));
    }
    // Change Order index
    @PutMapping("/updateOrder")
    public ResponseEntity<Group> updateOrder(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroupOrder(group));
    }

    // Modify the group
    @PutMapping()
    public ResponseEntity<Group> updateGroup(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroup(group));
    }

    // Delete the group
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
