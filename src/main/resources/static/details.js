const TMDB_KEY = "58bb691a579220ac910b7425872bcebb";

// Load selected movie
const movie = JSON.parse(localStorage.getItem("selectedMovie"));

async function getMovieImages(title) {
    try {
        const search = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${title}`);
        const data = await search.json();

        if (!data.results.length) return [];

        const id = data.results[0].id;

        const imgRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${TMDB_KEY}`);
        const imgData = await imgRes.json();

        const seen = new Set();
        const images = [];

        // 🔥 TAKE BOTH posters + backdrops (IMPORTANT)
        const allImages = [...imgData.posters, ...imgData.backdrops];

        for (let img of allImages) {
            if (!seen.has(img.file_path)) {
                seen.add(img.file_path);
                images.push(`https://image.tmdb.org/t/p/w500${img.file_path}`);
            }
        }

        // ✅ ALWAYS RETURN 4 IMAGES
        while (images.length < 4) {
            images.push("https://via.placeholder.com/300x450?text=No+Image");
        }

        return images.slice(0, 4);

    } catch (e) {
        console.log(e);
        return [
            "https://via.placeholder.com/300x450",
            "https://via.placeholder.com/300x450",
            "https://via.placeholder.com/300x450",
            "https://via.placeholder.com/300x450"
        ];
    }
}

function getOTT() {
    const platforms = ["Netflix", "Amazon Prime", "Hotstar", "Zee5"];
    return platforms[Math.floor(Math.random() * platforms.length)];
}

async function loadDetails() {
    const container = document.getElementById("detailsContainer");

    if (!movie) {
        container.innerHTML = "<h2>No movie selected</h2>";
        return;
    }

    container.innerHTML = "<h2>Loading...</h2>";

    const posters = await getMovieImages(movie.Title);

    const fallback = movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450";

    const allPosters = posters.length ? posters : [fallback];

	container.innerHTML = `
	    <div class="details-card">

	        <!-- LEFT SIDE -->
			<div class="details-left">
			    <div class="big-grid">
			        <img src="${allPosters[0]}" />
			        <img src="${allPosters[1]}" />
			        <img src="${allPosters[2]}" />
			        <img src="${allPosters[3]}" />
			    </div>
			</div>

	        <!-- RIGHT SIDE -->
	        <div class="details-right">
	            <h1>${movie.Title}</h1>

	            <p><b>Year:</b> ${movie.Year}</p>
	            <p><b>Genre:</b> ${movie.Genre}</p>

	            <p><b>IMDb:</b> <span class="star">★</span> ${movie.imdbRating}</p>

	            <p><b>Cast:</b> ${movie.Actors}</p>
	            <p><b>Director:</b> ${movie.Director}</p>

	            <p class="plot">${movie.Plot}</p>

	            <p><b>OTT:</b> <span class="ott">${getOTT(movie.Title)}</span></p>

	            <button onclick='toggleFavorite(${JSON.stringify(movie)})'>
	                ❤️ Favorite
	            </button>
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
function goHome() {
    window.location.href = "index.html";
}

function getOTT(title) {
    title = title.toLowerCase();

    if (title.includes("rrr")) return "Netflix";
    if (title.includes("pushpa")) return "Amazon Prime";
    if (title.includes("kgf")) return "Amazon Prime";
    if (title.includes("salaar")) return "Netflix";
    if (title.includes("Ala Vaikunthapurramuloo")) return "Hotstar";
    if (title.includes("Ee Nagaraniki Emaindi")) return "Amazon Prime";
    if (title.includes("dear comrade")) return "Amazon Prime";
    if (title.includes("Julayi")) return "Amazon Prime";

    return "Netflix"; // fallback
}
loadDetails();