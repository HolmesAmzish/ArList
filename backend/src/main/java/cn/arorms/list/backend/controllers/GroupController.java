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
        Long userId = jwt.getClaim("user_id");
        return groupService.getAllByUserId(userId);
    }

    // Add a new group
    @PostMapping()
    public ResponseEntity<Group> addGroup(@AuthenticationPrincipal Jwt jwt, @RequestBody Group group) {
        Long userId = jwt.getClaim("user_id");
        return ResponseEntity.ok(groupService.addGroup(userId, group));
    }
    // Change Order index
    @PutMapping("/updateOrder")
    public ResponseEntity<Group> updateOrder(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroupOrder(group));
    }

    // Modify the group
    @PutMapping()
    public ResponseEntity<Group> updateGroup(@AuthenticationPrincipal Jwt jwt, @RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroup(jwt.getClaim("user_id"), group));
    }

    // Delete the group
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        groupService.deleteGroup(id);
        return ResponseEntity.ok().build();
    }
}
