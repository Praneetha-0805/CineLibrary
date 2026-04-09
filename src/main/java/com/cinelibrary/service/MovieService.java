package com.cinelibrary.service;

import com.cinelibrary.entity.Movie;

import com.cinelibrary.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cinelibrary.entity.Cast;
import com.cinelibrary.entity.Crew;
import com.cinelibrary.entity.Media;
import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public List<Movie> searchMovies(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }

    public Movie getMovieById(Long id) {
        return movieRepository.findById(id).orElse(null);
    }
    
    public Movie saveMovie(Movie movie) {

        if (movie.getCastList() != null) {
            for (Cast cast : movie.getCastList()) {
                cast.setMovie(movie);
            }
        }

        if (movie.getCrewList() != null) {
            for (Crew crew : movie.getCrewList()) {
                crew.setMovie(movie);
            }
        }

        if (movie.getMediaList() != null) {
            for (Media media : movie.getMediaList()) {
                media.setMovie(movie);
            }
        }

        return movieRepository.save(movie);
    }
}
