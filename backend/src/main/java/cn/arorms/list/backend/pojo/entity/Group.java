package cn.arorms.list.backend.pojo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "groups")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Group {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
}
