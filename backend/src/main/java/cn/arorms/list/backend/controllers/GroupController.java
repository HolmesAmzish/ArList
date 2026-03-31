package cn.arorms.list.backend.controllers;

import cn.arorms.list.backend.pojos.entities.Group;
import cn.arorms.list.backend.services.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * GroupController
 * @version 2.0 2026-02-11
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
    public List<Group> getAllGroups(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return groupService.getAllByUsername(username);
    }

    // Add a new group
    @PostMapping()
    public ResponseEntity<Group> addGroup(@AuthenticationPrincipal Jwt jwt, @RequestBody Group group) {
        String username = jwt.getSubject();
        return ResponseEntity.ok(groupService.addGroup(username, group));
    }
    // Change Order index
    @PutMapping("/updateOrder")
    public ResponseEntity<Group> updateOrder(@AuthenticationPrincipal Jwt jwt, @RequestBody Group group) {
        String username = jwt.getSubject();
        return ResponseEntity.ok(groupService.updateGroupOrder(username, group));
    }

    // Modify the group
    @PutMapping()
    public ResponseEntity<Group> updateGroup(@AuthenticationPrincipal Jwt jwt, @RequestBody Group group) {
        String username = jwt.getSubject();
        return ResponseEntity.ok(groupService.updateGroup(username, group));
    }

    // Delete the group
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
