package com.cinelibrary.entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
public class Crew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String department;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}