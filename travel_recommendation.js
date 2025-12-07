const searchEl = document.getElementById("searchBtn");
const inputEl = document.getElementById("searchInput");
const clearEl = document.getElementById("clearBtn");
const resultEl = document.getElementById("result");

let locationData = {};

// fetch the json from the file
fetch("./travel_recommendation_api.json")
  .then((res) => res.json())
  .then((data) => {
    locationData = data;
  });

function searchLocations() {
  const search = inputEl.value.trim().toLowerCase();
  if (!search) {
    resultEl.innerHTML = "<p>Please enter something to search...</p>";
    return;
  }

  // Combine all categories into one array
  const allLocations = [
    ...locationData.countries.flatMap((coutry) => coutry.cities),
    ...locationData.beaches,
    ...locationData.temples,
  ];

  // Filter by name (case-insensitive)
  const matches = allLocations.filter((item) =>
    item.name.toLowerCase().includes(search)
  );

  if (matches.length === 0) {
    resultEl.innerHTML = "<p>No results found.</p>";
    // To show the results container
    resultEl.style.display = "flex";
    return;
  }

  // Display name + image
  resultEl.innerHTML = matches
    .map(
      (item) => `
      <div class="result-card">
        <div class="image-wrapper">
          <div class="time-label" data-timezone="${
            item.timezone || ""
          }">--:--</div>
          <img src="${item.imageUrl}" alt="${item.name}" />
        </div>
        <div class="card-content">
          <p class="location-name">${item.name}</p>
          <p class="location-description">${item.description || ""}</p>
          <button class="visit-btn">Visit</button>
        </div>
      </div>
    `
    )
    .join("");
  // To show the results container
  resultEl.style.display = "flex";
}

function clearSearch() {
  inputEl.value = "";
  resultEl.innerHTML = "";
  // To hide the results container
  resultEl.style.display = "none";
}

searchEl.addEventListener("click", searchLocations);
clearEl.addEventListener("click", clearSearch);

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchLocations();
  }
});

function updateTimes() {
  const timeLabels = document.querySelectorAll(".time-label");
  timeLabels.forEach((label) => {
    const timezone = label.dataset.timezone;
    if (!timezone) {
      label.textContent = "--:--";
      return;
    }
    // Use Intl.DateTimeFormat to get time in given timezone
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    };
    const formatter = new Intl.DateTimeFormat([], options);
    const timeString = formatter.format(now);
    label.textContent = `${timezone}: ${timeString}`;
  });
}

// Update times every 30 seconds
setInterval(updateTimes, 30000);

// Call once immediately after rendering
updateTimes();
