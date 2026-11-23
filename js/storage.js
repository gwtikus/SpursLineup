const FAVOURITES_KEY = "spurslineup-favourites";

function getFavourites() {
    try {
        const saved = localStorage.getItem(FAVOURITES_KEY);

        if (saved === null) {
            return [];
        }

        const favourites = JSON.parse(saved);

        if (!Array.isArray(favourites)) {
            return [];
        }

        return favourites.filter(function (id) {
            return Number.isInteger(id);
        });
    } catch (error) {
        console.error("Could not load favourites:", error);
        return [];
    }
}


function saveFavourites(favourites) {
    localStorage.setItem(
        FAVOURITES_KEY,
        JSON.stringify(favourites)
    );
}

const NOTES_KEY = "spurslineup-notes";

function getNotes() {
    try {
        const saved = localStorage.getItem(NOTES_KEY);

        if (saved === null) {
            return {};
        }

        const notes = JSON.parse(saved);

        if (
            notes === null ||
            typeof notes !== "object" ||
            Array.isArray(notes)
        ) {
            return {};
        }

        const validNotes = {};

        for (const [id, note] of Object.entries(notes)) {
            if (typeof note === "string") {
                validNotes[id] = note;
            }
        }

        return validNotes;
    } catch (error) {
        console.error("Could not load notes:", error);
        return {};
    }
}

function saveNotes(notes) {
    localStorage.setItem(
        NOTES_KEY,
        JSON.stringify(notes)
    );
}