const SPIELFELD_KLASSE = "spielfeld";
const SPIELANZEIGE_KLASSE = "spielanzeige";
const FELD_KLASSE = "feld";
const SPIELER_KLASSE = "spieler";
const GEGNER_KLASSE = "gegner";
const OVERLAY_KLASSE = "overlay";
const OVERLAY_TEXT_KLASSE = "overlay-text";
const OVERLAY_BUTTON_KLASSE = "overlay-button";
const SICHTBAR_KLASSE = "sichtbar";

const spielfeld = document.querySelector("." + SPIELFELD_KLASSE);
const spielanzeige = document.querySelector("." + SPIELANZEIGE_KLASSE);
const overlay = document.querySelector("." + OVERLAY_KLASSE);
const overlayText = document.querySelector("." + OVERLAY_TEXT_KLASSE);
const overlayButton = document.querySelector("." + OVERLAY_BUTTON_KLASSE);

const felder = document.querySelectorAll("." + FELD_KLASSE);

const SIEG_KOMBINATIONEN = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let aktuelleKlasse;

overlayButton.addEventListener("click", spielStarten);

spielStarten();

function klickVerarbeiten(ereignis) {
    if (aktuelleKlasse === GEGNER_KLASSE) {
        return;
    }

    const feld = ereignis.target;
    if (spielsteinSetzen(feld) === true) {
        zugBeenden();
    }
}

function spielsteinSetzen(feld) {
    if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
        return false;
    }

    feld.classList.add(aktuelleKlasse);
    return true;
}

function spielStarten() {
    overlay.classList.remove(SICHTBAR_KLASSE);
    aktuelleKlasse = null;

    felder.forEach(feld => {
        feld.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
        feld.removeEventListener("click", klickVerarbeiten);
        feld.addEventListener("click", klickVerarbeiten);
    });

    zugBeenden();
}

function zugBeenden() {
    if (siegPruefen(SPIELER_KLASSE)) {
        spielBeenden(SPIELER_KLASSE);
        return;
    }

    if (siegPruefen(GEGNER_KLASSE)) {
        spielBeenden(GEGNER_KLASSE);
        return;
    }

    if (unentschiedenPruefen()) {
        spielBeenden(null);
        return;
    }

    aktuelleKlasse = aktuelleKlasse === SPIELER_KLASSE ? GEGNER_KLASSE : SPIELER_KLASSE;
    spielanzeigeAktualisieren();

    if (aktuelleKlasse === GEGNER_KLASSE) {
        setTimeout(computerZugAusfuehren, 750);
    }
}

function spielanzeigeAktualisieren() {
    spielanzeige.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
    spielanzeige.innerText = aktuelleKlasse === SPIELER_KLASSE ? "Du bist am Zug." : "Der Gegner ist am Zug.";
    spielanzeige.classList.add(aktuelleKlasse);
}

function siegPruefen(spieler) {
    return SIEG_KOMBINATIONEN.some(kombination => {
        return kombination.every(index => {
            return felder[index].classList.contains(spieler);
        });
    });
}

function spielBeenden(gewinner) {
    if (gewinner === SPIELER_KLASSE) {
        overlayText.innerText = "Du hast gewonnen!";
    } else if (gewinner === GEGNER_KLASSE) {
        overlayText.innerText = "Der Gegner hat gewonnen!";
    } else {
        overlayText.innerText = "Unentschieden!";
    }

    overlay.classList.add(SICHTBAR_KLASSE);
}

function unentschiedenPruefen() {
    return [...felder].every(feld => {
        return feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE);
    });
}

function computerZugAusfuehren() {
    let besterZug = bestenZugFinden();
    if (besterZug !== null) {
        felder[besterZug].classList.add(GEGNER_KLASSE);
        zugBeenden();
    }
}

// Minimax Algorithmus
function minimax(istMaximierenderSpieler) {
    if (siegPruefen(GEGNER_KLASSE)) {
        return 10;
    } else if (siegPruefen(SPIELER_KLASSE)) {
        return -10;
    } else if (unentschiedenPruefen()) {
        return 0;
    }

    if (istMaximierenderSpieler) {
        let besterWert = -Infinity;
        felder.forEach((feld, index) => {
            if (!feld.classList.contains(SPIELER_KLASSE) && !feld.classList.contains(GEGNER_KLASSE)) {
                feld.classList.add(GEGNER_KLASSE);
                besterWert = Math.max(besterWert, minimax(false));
                feld.classList.remove(GEGNER_KLASSE);
            }
        });
        return besterWert;
    } else {
        let besterWert = Infinity;
        felder.forEach((feld, index) => {
            if (!feld.classList.contains(SPIELER_KLASSE) && !feld.classList.contains(GEGNER_KLASSE)) {
                feld.classList.add(SPIELER_KLASSE);
                besterWert = Math.min(besterWert, minimax(true));
                feld.classList.remove(SPIELER_KLASSE);
            }
        });
        return besterWert;
    }
}

function bestenZugFinden() {
    let besterWert = -Infinity;
    let besterZug = null;
    for (let i = 0; i < felder.length; i++) {
        if (!felder[i].classList.contains(SPIELER_KLASSE) && !felder[i].classList.contains(GEGNER_KLASSE)) {
            felder[i].classList.add(GEGNER_KLASSE);
            let zugWert = minimax(false);
            felder[i].classList.remove(GEGNER_KLASSE);
            if (zugWert > besterWert) {
                besterWert = zugWert;
                besterZug = i;
            }
        }
    }
    return besterZug;
}
