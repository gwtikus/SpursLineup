const playerList = document.querySelector("#player-list");
const searchInput = document.querySelector("#player-search");
const positionFilter = document.querySelector("#position-filter");
const sortBy = document.querySelector("#sort-by");
const sortOrder = document.querySelector("#sort-order");
const positionOrder = ["Guard", "Forward", "Center"];
const favouritesOnly = document.querySelector("#favourites-only");

function displayPlayers(list) {
    playerList.replaceChildren();
    const favourites = getFavourites();

    if (list.length === 0) {
        const row = document.createElement("tr");
        const message = document.createElement("td");

        message.colSpan = 4;
        message.textContent = "No players found.";

        row.appendChild(message);
        playerList.appendChild(row);
        return;
    }

    for (const player of list) {
        const row = document.createElement("tr");

        const playerCell = document.createElement("td");
        const playerSummary = document.createElement("div");
        playerSummary.className = "roster-player"
        
        if (favourites.includes(player.id)) {
            const badge = document.createElement("span");
            badge.className = "favourite-badge";
            badge.textContent = "Favourite";

            playerSummary.appendChild(badge);
        }

        const image = document.createElement("img");
        image.src = player.image;
        image.alt = "";

        const link = document.createElement("a");
        link.href = `player.html?id=${player.id}`;
        link.textContent = player.name;

        playerSummary.appendChild(image);
        playerSummary.appendChild(link);
        playerCell.appendChild(playerSummary);

        const positionCell = document.createElement("td");
        positionCell.textContent = player.positions.join(" / ");

        const ageCell = document.createElement("td");
        ageCell.textContent = player.age;

        const heightCell = document.createElement("td");
        heightCell.textContent = player.height;

        row.appendChild(playerCell);
        row.appendChild(positionCell);
        row.appendChild(ageCell);
        row.appendChild(heightCell);

        playerList.appendChild(row);
    }
}

function updateRoster() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedPosition = positionFilter.value;
    const favourites = getFavourites();

    const matches = players.filter(function (player) {
        const matchesName = player.name.toLowerCase().includes(query);

        const matchesPosition = selectedPosition === "all" || player.positions.includes(selectedPosition);

        const matchesFavourite = !favouritesOnly.checked || favourites.includes(player.id);
        return matchesName && matchesPosition && matchesFavourite;
    });

    matches.sort(function (a, b) {
        let result = 0;

        if (sortBy.value === "name") {
            result = a.name.localeCompare(b.name);
        } else if (sortBy.value === "age") {
            result = a.age - b.age;
        } else if (sortBy.value === "height") {
            result = a.heightInches - b.heightInches;
        } else if (
            sortBy.value === "position" &&
            selectedPosition === "all") {
            result =
                positionOrder.indexOf(a.positions[0]) -
                positionOrder.indexOf(b.positions[0]);
        }

        if (sortOrder.value === "desc") {
            result = -result;
        }

        if (result === 0) {
            return a.name.localeCompare(b.name);
        }

        return result;
    });

    displayPlayers(matches);
}

searchInput.addEventListener("input", updateRoster);
positionFilter.addEventListener("change", updateRoster);
sortBy.addEventListener("change", updateRoster);
sortOrder.addEventListener("change", updateRoster);
favouritesOnly.addEventListener("change", updateRoster);

updateRoster();