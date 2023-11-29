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
    if (feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE)) {
        return;
    }

    feld.classList.add(aktuelleKlasse);
    feld.disabled = true;

    zugBeenden();
}

function spielStarten() {
    overlay.classList.remove(SICHTBAR_KLASSE);

    for(const feld of felder) {
        feld.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
        feld.disabled = false;
        feld.removeEventListener("click", klickVerarbeiten);
        feld.addEventListener("click", klickVerarbeiten);
    }

    aktuelleKlasse = Math.random() < 0.5 ? SPIELER_KLASSE : GEGNER_KLASSE;
    spielanzeigeAktualisieren();

    if (aktuelleKlasse === GEGNER_KLASSE) {
        setTimeout(computerZugAusfuehren, 750);
    }
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

    if (aktuelleKlasse === GEGNER_KLASSE) {
        setTimeout(computerZugAusfuehren, 750);
    }
}

function spielanzeigeAktualisieren() {
    spielanzeige.classList.remove(SPIELER_KLASSE, GEGNER_KLASSE);
    spielanzeige.innerText = aktuelleKlasse === SPIELER_KLASSE ? "Du bist am Zug." : "Der Gegner ist am Zug.";
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
    overlayText.innerText = unentschieden ? "Unentschieden!" : aktuelleKlasse === SPIELER_KLASSE ? "Du hast gewonnen!" : "Der Gegner hat gewonnen!";
    overlayText.classList.add(aktuelleKlasse);
    overlay.classList.add(SICHTBAR_KLASSE);
}

function unentschiedenPruefen() {
    return Array.from(felder).every(feld => feld.classList.contains(SPIELER_KLASSE) || feld.classList.contains(GEGNER_KLASSE));
}

function computerZugAusfuehren() {
    // Prüfen auf mögliche Gewinnzüge oder Blockierung des Gegners
    let besterZug = findeBestenZug();

    if (besterZug !== null) {
        felder[besterZug].classList.add(aktuelleKlasse);
        felder[besterZug].disabled = true;
        zugBeenden();
        return;
    }

    // Wenn kein Gewinn- oder Blockierungszug vorhanden ist, wähle zufällig
    let zufallsIndex;
    do {
        zufallsIndex = Math.floor(Math.random() * 9);
    } while (felder[zufallsIndex].classList.contains(SPIELER_KLASSE) || felder[zufallsIndex].classList.contains(GEGNER_KLASSE));

    felder[zufallsIndex].classList.add(aktuelleKlasse);
    felder[zufallsIndex].disabled = true;
    zugBeenden();
}

function findeBestenZug() {
    for (let i = 0; i < SIEG_KOMBINATIONEN.length; i++) {
        let kombination = SIEG_KOMBINATIONEN[i];

        let gegnerFelder = kombination.filter(feld => feld.classList.contains(SPIELER_KLASSE));
        let eigeneFelder = kombination.filter(feld => feld.classList.contains(GEGNER_KLASSE));
        let freieFelder = kombination.filter(feld => !feld.classList.contains(SPIELER_KLASSE) && !feld.classList.contains(GEGNER_KLASSE));

        if (eigeneFelder.length === 2 && freieFelder.length === 1) {
            return Array.from(felder).indexOf(freieFelder[0]);
        }

        if (gegnerFelder.length === 2 && freieFelder.length === 1) {
            return Array.from(felder).indexOf(freieFelder[0]);
        }
    }

    return null;
}
