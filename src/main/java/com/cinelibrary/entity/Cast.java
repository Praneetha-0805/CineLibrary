package com.cinelibrary.entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Cast {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore   
    private Movie movie;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}