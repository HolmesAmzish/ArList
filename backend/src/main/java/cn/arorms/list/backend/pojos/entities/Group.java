package cn.arorms.list.backend.pojos.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "groups")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Group {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "order_index")
    private int orderIndex;

    private String description;

    // Username from JWT subject
    @Column(name = "created_by")
    private String createdBy;
}
