const lineupForm = document.querySelector("#lineup-form");
const lineupName = document.querySelector("#lineup-name");
const selectContainer = document.querySelector("#player-selects");
const lineupMessage = document.querySelector("#lineup-message");
const saveButton = document.querySelector("#save-lineup");
const cancelEditButton = document.querySelector("#cancel-edit");
const lineupList = document.querySelector("#lineup-list");
const formHeading = document.querySelector("#form-heading");

const LINEUP_SIZE = 5;
const playerSelects = [];
let editingId = null;

function createSelects() {
    for (let i = 0; i < LINEUP_SIZE; i++) {
        const row = document.createElement("div");
        row.className = "select-row";

        const label = document.createElement("label");
        label.htmlFor = `player-select-${i}`;
        label.textContent = `Player ${i + 1}`;

        const select = document.createElement("select");
        select.id = `player-select-${i}`;

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose a player";
        select.appendChild(placeholder);

        players.forEach(function (player) {
            const option = document.createElement("option");
            option.value = String(player.id);
            option.textContent = `${player.name} (#${player.jersey})`;
            select.appendChild(option);
        });

        row.appendChild(label);
        row.appendChild(select);
        selectContainer.appendChild(row);
        playerSelects.push(select);
    }
}

function getPlayer(id) {
    return players.find(function (item) {
        return item.id === id;
    });
}

function validateLineup(name, selectedValues) {
    if (name === "") {
        return "Please enter a lineup name.";
    }

    if (selectedValues.includes("")) {
        return `Please choose all ${LINEUP_SIZE} players.`;
    }

    if (new Set(selectedValues).size !== selectedValues.length) {
        return "Each player can only be chosen once.";
    }

    return "";
}

function resetForm() {
    editingId = null;
    lineupForm.reset();
    formHeading.textContent = "Create a lineup";
    saveButton.textContent = "Save lineup";
    cancelEditButton.hidden = true;
}

function isNameTaken(name, lineups) {
    const wanted = name.toLowerCase();

    return lineups.some(function (lineup) {
        return lineup.id !== editingId && lineup.name.toLowerCase() === wanted;
    });
}

function handleSave(event) {
    event.preventDefault();

    const name = lineupName.value.trim();
    const selectedValues = playerSelects.map(function (select) {
        return select.value;
    });

    const error = validateLineup(name, selectedValues);

    if (error !== "") {
        lineupMessage.textContent = error;
        return;
    }

    let lineups = getLineups();

    if (isNameTaken(name, lineups)) {
        lineupMessage.textContent = "A lineup with that name already exists. Please choose another name.";
        lineupName.focus();
        return;
    }

    const playerIds = selectedValues.map(Number);

    if (editingId === null) {
        lineups.push({ id: Date.now(), name: name, playerIds: playerIds });
        lineupMessage.textContent = "Lineup saved.";
    } else {
        lineups = lineups.map(function (lineup) {
            return lineup.id === editingId
                ? { id: lineup.id, name: name, playerIds: playerIds }
                : lineup;
        });
        lineupMessage.textContent = "Lineup updated.";
    }

    saveLineups(lineups);
    resetForm();
    displayLineups();
}

function startEditing(id) {
    const lineup = getLineups().find(function (item) {
        return item.id === id;
    });

    if (!lineup) {
        return;
    }

    editingId = id;
    lineupName.value = lineup.name;

    playerSelects.forEach(function (select, index) {
        select.value = String(lineup.playerIds[index]);
    });

    formHeading.textContent = "Edit lineup";
    saveButton.textContent = "Update lineup";
    cancelEditButton.hidden = false;
    lineupMessage.textContent = "";
    lineupName.focus();
}

function cancelEditing() {
    resetForm();
    lineupMessage.textContent = "Edit cancelled.";
}

function deleteLineup(id) {
    const confirmed = window.confirm(
        "Delete this lineup? This cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    const lineups = getLineups().filter(function (lineup) {
        return lineup.id !== id;
    });

    saveLineups(lineups);

    if (editingId === id) {
        resetForm();
    }

    displayLineups();
    lineupMessage.textContent = "Lineup deleted.";
}

function displayLineups() {
    const lineups = getLineups();
    lineupList.textContent = "";

    if (lineups.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No lineups saved yet.";
        lineupList.appendChild(empty);
        return;
    }

    lineups.forEach(function (lineup) {
        const card = document.createElement("article");
        card.className = "lineup-card";

        const title = document.createElement("h3");
        title.textContent = lineup.name;

        const names = document.createElement("ol");
        lineup.playerIds.forEach(function (id) {
            const player = getPlayer(id);
            const item = document.createElement("li");
            item.className = "lineup-player";

            if (player) {
                const image = document.createElement("img");
                image.src = player.image;
                image.alt = "";
                item.appendChild(image);
            }

            const label = document.createElement("span");
            label.textContent = player ? player.name : "Unknown player";
            item.appendChild(label);

            names.appendChild(item);
        });

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", `Edit lineup ${lineup.name}`);
        editButton.addEventListener("click", function () {
            startEditing(lineup.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete lineup ${lineup.name}`);
        deleteButton.addEventListener("click", function () {
            deleteLineup(lineup.id);
        });

        card.appendChild(title);
        card.appendChild(names);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        lineupList.appendChild(card);
    });
}

createSelects();
displayLineups();
lineupForm.addEventListener("submit", handleSave);
cancelEditButton.addEventListener("click", cancelEditing);