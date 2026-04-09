const API_KEY = "d20a22b6";
const TMDB_KEY = "58bb691a579220ac910b7425872bcebb";

const defaultMovies = [
    "RRR",
    "Ala Vaikunthapurramuloo",
    "Ee Nagaraniki Emaindi",
    "Dear Comrade",
    "Pushpa:The Rise",
    "K.G.F:Chapter 2",
    "Salaar",
	"Khaidi No.150",
	"Devara",
	"Julayi"
];


async function fetchMovie(name) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?t=${name}&apikey=${API_KEY}`);
        const data = await res.json();
        if (data.Response === "False") return null;
        return data;
    } catch {
        return null;
    }
}


async function loadMovies() {
    const container = document.getElementById("movieContainer");
    container.innerHTML = "";

    for (let name of defaultMovies) {
        const movie = await fetchMovie(name);
        if (!movie) continue;

        const poster = movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450";

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${poster}" />
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>⭐ ${movie.imdbRating}</p>
            </div>
        `;

		card.addEventListener("click", () => {
		    localStorage.setItem("selectedMovie", JSON.stringify(movie));
		    window.location.href = "details.html";
		});

        container.appendChild(card);
    }
}


async function searchMovie() {
    const input = document.getElementById("searchInput").value.trim();
    const container = document.getElementById("movieContainer");

    if (!input) {
        alert("Please enter movie name");
        return;
    }

    container.innerHTML = "<h2>Searching...</h2>";

    const movie = await fetchMovie(input);

    if (!movie) {
        container.innerHTML = "<h2>Movie not found 😢</h2>";
        return;
    }

    const poster = movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450";

    const card = document.createElement("div");
    card.className = "movie-card";

    card.innerHTML = `
        <img src="${poster}" />
        <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>⭐ ${movie.imdbRating}</p>
        </div>
    `;

    // ✅ CLICK WORKING
    card.addEventListener("click", () => {
        localStorage.setItem("selectedMovie", JSON.stringify(movie));
        window.location.href = "details.html";
    });

    container.innerHTML = "";
    container.appendChild(card);
}


async function getMovieImages(title) {
    try {
        const search = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${title}`);
        const data = await search.json();

        if (!data.results.length) return [];

        const id = data.results[0].id;

        const imgRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_KEY}`);
        const imgData = await imgRes.json();

        return imgData.posters.slice(0, 3).map(img =>
            `https://image.tmdb.org/t/p/w500${img.file_path}`
        );
    } catch {
        return [];
    }
}


function getOTT() {
    const platforms = ["Netflix", "Amazon Prime", "Hotstar", "Zee5"];
    return platforms[Math.floor(Math.random() * platforms.length)];
}


async function showDetails(movie) {
    const section = document.getElementById("detailsSection");

    section.innerHTML = "<h2>Loading details...</h2>";

    const posters = await getMovieImages(movie.Title);

    const fallback = movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450";

    const allPosters = posters.length ? posters : [fallback];

    section.innerHTML = `
        <div style="display:flex; gap:40px; margin-top:20px;">

            <!-- LEFT SIDE -->
            <div style="flex:2;">
                <h1>${movie.Title}</h1>

                <p><b>Year:</b> ${movie.Year}</p>
                <p><b>Genre:</b> ${movie.Genre}</p>
                <p><b>IMDb:</b> <span style="color:gold; font-size:18px;">★</span> ${movie.imdbRating}</p>

                <p><b>Cast:</b> ${movie.Actors}</p>
                <p><b>Director:</b> ${movie.Director}</p>

                <p><b>Story:</b><br>${movie.Plot}</p>

                <p><b>OTT:</b> 
                    <span style="color:#a855f7;">${getOTT()}</span>
                </p>

                <br>

                <a href="https://www.google.com/search?q=${movie.Title}+movie+review" target="_blank">
                    🔗 Read Blogs & Reviews
                </a>
            </div>

            <!-- RIGHT SIDE -->
            <div style="flex:1; display:flex; flex-direction:column; gap:15px;">
                ${allPosters.map(p => `
                    <img src="${p}" style="width:100%; border-radius:12px;" />
                `).join("")}
            </div>

        </div>
    `;
}

function toggleFavorite(movie) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = favs.find(m => m.imdbID === movie.imdbID);

    if (exists) {
        favs = favs.filter(m => m.imdbID !== movie.imdbID);
        alert("Removed from Favorites ❌");
    } else {
        favs.push(movie);
        alert("Added to Favorites ❤️");
    }

    localStorage.setItem("favorites", JSON.stringify(favs));
}


function showFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("movieContainer");

    container.innerHTML = "<h2>Your Favorites</h2>";

    favs.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${movie.Poster}" />
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>⭐ ${movie.imdbRating}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("selectedMovie", JSON.stringify(movie));
            window.location.href = "details.html";
        });

        container.appendChild(card);
    });
}

async function filterGenre(genre) {
    const container = document.getElementById("movieContainer");
    container.innerHTML = "<h2>Loading...</h2>";

    container.innerHTML = "";

    for (let name of defaultMovies) {
        const movie = await fetchMovie(name);
        if (!movie) continue;

        if (genre !== "all" && !movie.Genre.includes(genre)) continue;

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <img src="${movie.Poster}" />
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>⭐ ${movie.imdbRating}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("selectedMovie", JSON.stringify(movie));
            window.location.href = "details.html";
        });

        container.appendChild(card);
    }
}
loadMovies();