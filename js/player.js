const playerName = document.querySelector("#player-name");
const playerDetails = document.querySelector("#player-details");
const previousPlayer = document.querySelector("#previous-player");
const nextPlayer = document.querySelector("#next-player");
const playerActions = document.querySelector("#player-actions");
const favouriteButton = document.querySelector("#favourite-button");
const playerNotes = document.querySelector("#player-notes");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const savedNote = document.querySelector("#saved-note");
const noteStatus = document.querySelector("#note-status");
const noteActions = document.querySelector("#note-actions");
const editNoteButton = document.querySelector("#edit-note");
const deleteNoteButton = document.querySelector("#delete-note");
const cancelNoteButton = document.querySelector("#cancel-note");

const params = new URLSearchParams(window.location.search);
const idFromUrl = params.get("id");

const playerId = idFromUrl === null ? 1 : Number(idFromUrl);

const playerIndex = players.findIndex(function (player) {
    return player.id === playerId;
});


function displayPlayer(player) {
    playerName.textContent = player.name;
    document.title = `${player.name} | SpursLineup`;

    const image = document.createElement("img");
    image.src = player.image;
    image.alt = player.name;

    const information = document.createElement("div");
    information.className = "player-information";

    const jersey = document.createElement("p");
    jersey.textContent = `Jersey number: ${player.jersey}`;

    const position = document.createElement("p");
    position.textContent = `Position: ${player.positions.join(" / ")}`;

    const age = document.createElement("p");
    age.textContent = `Age: ${player.age}`;

    const height = document.createElement("p");
    height.textContent = `Height: ${player.height}`;

    const weight = document.createElement("p");
    weight.textContent = `Weight: ${player.weightLbs} lbs`;

    const college = document.createElement("p");
    college.textContent = `College: ${player.college}`;

    information.appendChild(jersey);
    information.appendChild(position);
    information.appendChild(age);
    information.appendChild(height);
    information.appendChild(weight);
    information.appendChild(college);   

    playerDetails.appendChild(image);
    playerDetails.appendChild(information);
}


function setupPlayerNavigation(index) {
    if (index > 0) {
        const previous = players[index - 1];
        previousPlayer.href = `player.html?id=${previous.id}`;
        previousPlayer.setAttribute("aria-label", `Previous player: ${previous.name}`);
        previousPlayer.hidden = false;
    }

    if (index < players.length - 1) {
        const next = players[index + 1];
        nextPlayer.href = `player.html?id=${next.id}`;
        nextPlayer.setAttribute("aria-label", `Next player: ${next.name}`);
        nextPlayer.hidden = false;
    }
}

function updateFavouriteButton() {
    const favourites = getFavourites();
    const isFavourite = favourites.includes(playerId);

    favouriteButton.textContent = isFavourite
        ? "Remove from favourites"
        : "Add to favourites";

    favouriteButton.setAttribute("aria-pressed", String(isFavourite));
}


function toggleFavourite() {
    let favourites = getFavourites();

    if (favourites.includes(playerId)) {
        favourites = favourites.filter(function (id) {
            return id !== playerId;
        });
    } else {
        favourites.push(playerId);
    }

    saveFavourites(favourites);
    updateFavouriteButton();
}

function displayNote() {
    const notes = getNotes();
    const note = notes[playerId] || "";
    const hasNote = note !== "";

    savedNote.textContent = hasNote ? note : "No note saved yet.";
    savedNote.hidden = false;

    noteInput.value = note;
    noteForm.hidden = hasNote;
    noteActions.hidden = !hasNote;
    cancelNoteButton.hidden = true;
}


function handleSaveNote(event) {
    event.preventDefault();

    const text = noteInput.value.trim();

    if (text === "") {
        noteStatus.textContent = "Please enter a note before saving.";
        return;
    }

    const notes = getNotes();
    notes[playerId] = text;

    saveNotes(notes);
    displayNote();

    noteStatus.textContent = "Note saved.";
}


function startEditingNote() {
    noteForm.hidden = false;
    noteActions.hidden = true;
    savedNote.hidden = true;
    cancelNoteButton.hidden = false;

    noteStatus.textContent = "";
    noteInput.focus();
}


function cancelEditingNote() {
    displayNote();
    noteStatus.textContent = "Changes cancelled.";
    editNoteButton.focus();
}


function deletePlayerNote() {
    const confirmed = window.confirm(
        "Delete this player's note? This cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    const notes = getNotes();
    delete notes[playerId];

    saveNotes(notes);
    displayNote();

    noteStatus.textContent = "Note deleted.";
    noteInput.focus();
}

if (playerIndex !== -1) {
    displayPlayer(players[playerIndex]);
    setupPlayerNavigation(playerIndex);
    playerActions.hidden = false;
    updateFavouriteButton();
    favouriteButton.addEventListener("click", toggleFavourite);
    playerNotes.hidden = false;
    displayNote();
    noteForm.addEventListener("submit", handleSaveNote);
    editNoteButton.addEventListener("click", startEditingNote);
    deleteNoteButton.addEventListener("click", deletePlayerNote);
    cancelNoteButton.addEventListener("click", cancelEditingNote);
} else {
    playerName.textContent = "Player not found";
    const message = document.createElement("p");
    message.textContent = "Please go back to the roster and select a player.";
    playerDetails.appendChild(message);
}