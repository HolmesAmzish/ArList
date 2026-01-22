package cn.arorms.list.backend.controller;

import cn.arorms.list.backend.pojo.entity.Group;
import cn.arorms.list.backend.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/group")
public class GroupController {
    @Autowired
    private GroupService groupService;
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping()
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @PostMapping()
    public ResponseEntity<Group> addGroup(@RequestBody Group group) {
        return ResponseEntity.ok(groupService.addGroup(group));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@ @RequestBody Group group) {
        return ResponseEntity.ok(groupService.updateGroup(group));
    }

    @DeleteMapping("/{id}")
    public Response
}
