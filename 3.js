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
    [felder[0], felder[1], felder[2]],
    [felder[3], felder[4], felder[5]],
    [felder[6], felder[7], felder[8]],
    [felder[0], felder[3], felder[6]],
    [felder[1], felder[4], felder[7]],
    [felder[2], felder[5], felder[8]],
    [felder[0], felder[4], felder[8]],
    [felder[2], felder[4], felder[6]],
];

let aktuelleKlasse;

overlayButton.addEventListener("click", spielStarten);

spielStarten();

function klickVerarbeiten(ereignis) {
    const feld = ereignis.target;
    if (spielsteinSetzen(feld)) {
        zugBeenden();
    }
}

function spielsteinSetzen(feld) {
    if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
        return false;
    }
    feld.classList.add(aktuelleKlasse);
    feld.disabled = true;
    return true;
}

function spielStarten() {
    overlay.classList.remove(SICHTBAR_KLASSE);
    aktuelleKlasse = null;
    for (const feld of felder) {
        feld.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
        feld.disabled = false;
        feld.addEventListener("click", klickVerarbeiten);
    }
    zugBeenden();
}

function zugBeenden() {
    if (siegPruefen()) {
        spielBeenden(false);
        return;
    }
    if (unentschiedenPruefen()) {
        spielBeenden(true);
        return;
    }
    aktuelleKlasse = (aktuelleKlasse === SPIELER_KLASSE) ? GEGNER_KLASSE : SPIELER_KLASSE;
    spielanzeigeAktualisieren();
}

function spielanzeigeAktualisieren() {
    spielanzeige.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
    if (aktuelleKlasse === SPIELER_KLASSE) {
        spielanzeige.innerText = "O ist am Zug.";
        spielfeld.classList.add(SPIELER_KLASSE);
        spielfeld.classList.remove(GEGNER_KLASSE);
    } else {
        spielanzeige.innerText = "X ist am Zug.";
        spielfeld.classList.add(GEGNER_KLASSE);
        spielfeld.classList.remove(SPIELER_KLASSE);
    }
    spielanzeige.classList.add(aktuelleKlasse);
}

function siegPruefen() {
    for (const kombination of SIEG_KOMBINATIONEN) {
        if (kombination.every(feld => feld.classList.contains(aktuelleKlasse))) {
            return true;
        }
    }
    return false;
}

function spielBeenden(unentschieden) {
    overlayText.innerText = unentschieden ? "Unentschieden!" : (aktuelleKlasse === SPIELER_KLASSE ? "O hat gewonnen!" : "X hat gewonnen!");
    overlayText.classList.add(aktuelleKlasse);
    overlay.classList.add(SICHTBAR_KLASSE);
}

function unentschiedenPruefen() {
    return [...felder].every(feld => feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE));
}