// ====================
// HOME PAGE LOGIC (LIST + SEARCH + SLIDER + SUGGESTIONS)
// ====================
document.addEventListener("DOMContentLoaded", () => {

  const list = document.getElementById("animeList");
  const search = document.getElementById("search");
  const suggestionsBox = document.getElementById("suggestions");
  const slider = document.getElementById("trendingSlider");

  if (typeof animeData === "undefined") return;

  // -------- RENDER ANIME GRID --------
  function renderAnime(data) {
    if (!list) return;

    list.innerHTML = "";
    data.forEach(anime => {
      list.innerHTML += `
        <div class="card" onclick="openAnime(${anime.id})">
          <img src="${anime.poster || 'p1.jpeg'}" onerror="this.src='p1.jpeg'">
          <p>${anime.title}</p>
        </div>
      `;
    });
  }

  if (list) renderAnime(animeData);

  // -------- SEARCH + SUGGESTIONS --------
  if (search && suggestionsBox) {
    search.addEventListener("input", () => {
      const value = search.value.trim().toLowerCase();
      suggestionsBox.innerHTML = "";

      if (!value) {
        suggestionsBox.style.display = "none";
        renderAnime(animeData);
        return;
      }

      const matches = animeData.filter(a =>
        a.title.toLowerCase().includes(value)
      );

      // Update grid
      renderAnime(matches);

      // Show suggestions
      matches.slice(0, 6).forEach(anime => {
        const div = document.createElement("div");
        div.className = "suggestion-item";
        div.textContent = anime.title;
        div.onclick = () => openAnime(anime.id);
        suggestionsBox.appendChild(div);
      });

      suggestionsBox.style.display = matches.length ? "block" : "none";
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) {
        suggestionsBox.style.display = "none";
      }
    });
  }

  // -------- CATEGORY FILTER --------
  window.filterAnime = function (category) {
    if (category === "All") renderAnime(animeData);
    else renderAnime(animeData.filter(a => a.category === category));
  };

  // -------- OPEN ANIME --------
  window.openAnime = function (id) {
    localStorage.setItem("animeId", id);
    window.location.href = "anime.html";
  };

  // -------- TRENDING SLIDER --------
  if (slider) {
    const trending = animeData.slice(0, 5);
    let index = 0;

    slider.innerHTML = "";

    trending.forEach(anime => {
      slider.innerHTML += `
        <div class="slide" onclick="openAnime(${anime.id})">
          <img src="${anime.poster || 'p1.jpeg'}" onerror="this.src='p1.jpeg'">
          <div class="slide-overlay">
            <h3>${anime.title}</h3>
          </div>
        </div>
      `;
    });

    setInterval(() => {
      index = (index + 1) % trending.length;
      slider.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  }

});


// ====================
// EPISODE / PLAYER PAGE LOGIC
// ====================
document.addEventListener("DOMContentLoaded", () => {

  const animeId = localStorage.getItem("animeId");
  if (!animeId || typeof animeData === "undefined") return;

  const anime = animeData.find(a => a.id == animeId);
  if (!anime) return;

  const title = document.getElementById("animeTitle");
  const episodeList = document.getElementById("episodeList");
  const videoPlayer = document.getElementById("videoPlayer");
  const ytPlayer = document.getElementById("ytPlayer");
  const downloadBtn = document.getElementById("downloadBtn");

  if (title) title.innerText = anime.title;

  function resetPlayers() {
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.removeAttribute("src");
      videoPlayer.load();
      videoPlayer.style.display = "none";
    }

    if (ytPlayer) {
      ytPlayer.src = "";
      ytPlayer.style.display = "none";
    }

    if (downloadBtn) {
      downloadBtn.style.display = "none";
      downloadBtn.removeAttribute("href");
    }
  }

  anime.episodes.forEach(ep => {
    const btn = document.createElement("button");
    btn.innerText = ep.name;

    btn.onclick = () => {
      resetPlayers();

      if (ep.video.includes("youtube.com/embed")) {
        ytPlayer.style.display = "block";
        ytPlayer.src = ep.video;
      } else {
        videoPlayer.style.display = "block";
        videoPlayer.src = ep.video;
        videoPlayer.play();

        if (downloadBtn) {
          downloadBtn.style.display = "block";
          downloadBtn.href = ep.video;
        }
      }
    };

    episodeList.appendChild(btn);
  });

});
