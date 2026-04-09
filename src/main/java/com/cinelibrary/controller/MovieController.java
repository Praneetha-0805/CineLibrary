package com.cinelibrary.controller;

import java.awt.PageAttributes.MediaType;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.cinelibrary.entity.Cast;
import com.cinelibrary.entity.Crew;
import com.cinelibrary.entity.Media;
import com.cinelibrary.entity.Movie;
import com.cinelibrary.service.MovieService;
import com.cinelibrary.service.S3Service;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/movies")
@CrossOrigin
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private S3Service s3Service;

    // ✅ Get all movies
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // ✅ Search movies
    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieService.searchMovies(title);
    }

    // ✅ Get movie by ID
    @GetMapping("/{id}")
    public Movie getMovie(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    // ✅ Add movie (without images)
    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.saveMovie(movie);
    }

    // ✅ Upload multiple images to S3
    @PostMapping("/upload-multiple")
    public List<String> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {
            String url = s3Service.uploadFile(file);
            urls.add(url);
        }

        return urls;
    }

    // 🔥 FINAL WORKING API
    @PostMapping(value = "/create-with-images", 
    		consumes = "multipart/form-data")
    public Movie createMovieWithImages(
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("movie") String movieJson) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Movie movie = objectMapper.readValue(movieJson, Movie.class);

            // 🔥 FIX 1: Link Cast
            if (movie.getCastList() != null) {
                for (Cast cast : movie.getCastList()) {
                    cast.setMovie(movie);
                }
            }

            // 🔥 FIX 2: Link Crew
            if (movie.getCrewList() != null) {
                for (Crew crew : movie.getCrewList()) {
                    crew.setMovie(movie);
                }
            }

            // 🔥 Upload Images
            List<Media> mediaList = new ArrayList<>();

            for (MultipartFile file : files) {
                String url = s3Service.uploadFile(file);

                Media media = new Media();
                media.setImageUrl(url);
                media.setMovie(movie);

                mediaList.add(media);
            }

            movie.setMediaList(mediaList);

            return movieService.saveMovie(movie);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("ERROR: " + e.getMessage());
        }
    }
}