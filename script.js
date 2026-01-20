// ---------------------------
// Sélecteurs
// ---------------------------
const nbPostesInput = document.getElementById("nbPostes");
const btnValiderPostes = document.getElementById("btnValiderPostes");

const container = document.getElementById("postesContainer");
const posteTemplate = document.getElementById("posteTemplate");
const etapeTemplate = document.getElementById("etapeTemplate");

// ---------------------------
// 1) Création des postes
// ---------------------------
function creerPostes(n) {
    container.innerHTML = "";

    n = parseInt(n, 10);
    if (Number.isNaN(n) || n < 1) n = 1;

    for (let i = 1; i <= n; i++) {
        const clone = posteTemplate.content.cloneNode(true);
        const form = clone.querySelector("form.poste");

        form.querySelector(".poste-title").textContent = `Poste ${i}`;

        // valeur par défaut
        const nbEtapesInput = form.querySelector(".nbEtapes");
        if (!nbEtapesInput.value) nbEtapesInput.value = 1;

        // création initiale des étapes
        creerEtapesPour(form);

        container.appendChild(clone);
    }
}

// ---------------------------
// 2) Création des étapes (pour UN poste)
// ---------------------------
function creerEtapesPour(form) {
    const nb = parseInt(form.querySelector(".nbEtapes").value, 10);
    const etapesContainer = form.querySelector(".etapesContainer");
    etapesContainer.innerHTML = "";

    const n = Number.isNaN(nb) || nb < 1 ? 1 : nb;

    for (let i = 1; i <= n; i++) {
        const etapeClone = etapeTemplate.content.cloneNode(true);
        etapeClone.querySelector(".etape-title").textContent = `Étape ${i}`;
        etapesContainer.appendChild(etapeClone);
    }
}

// ---------------------------
// 3) Lecture données (manuel)
// ---------------------------
function lireDonneesPoste(posteForm) {
    return {
        nbEtape: posteForm.querySelector('[name="nbEtape"]').value,
        listepieces: posteForm.querySelector('[name="listepieces"]').value,
        stock: posteForm.querySelector('[name="stock"]').value
    };
}

function lireDonneesEtapes(posteForm) {
    return Array.from(posteForm.querySelectorAll(".etape")).map((etapeEl, i) => ({
        etape: i + 1,
        piecesUtilisees: etapeEl.querySelector('[name="piecesUtilisees"]')?.value ?? "",
        nbPieces: etapeEl.querySelector('[name="nbPieces"]')?.value ?? ""
    }));
}

// ---------------------------
// 4) CSV séparés
// ---------------------------
function creerCsvPoste(dataPoste) {
    const lines = [];
    lines.push("nbEtapes,listepieces,stock");
    lines.push(`${dataPoste.nbEtape},${dataPoste.listepieces},${dataPoste.stock}`);
    return lines.join("\n");
}

function creerCsvEtapes(etapes) {
    const lines = [];
    lines.push("etape,piecesUtilisees,nbPieces");
    for (const e of etapes) {
        lines.push(`${e.etape},${e.piecesUtilisees},${e.nbPieces}`);
    }
    return lines.join("\n");
}

// ---------------------------
// 5) Parse + affichage (tes fonctions)
// ---------------------------
function parseCsv(text) {
    return text
        .trim()
        .split(/\r?\n/)
        .map(line => line.split(",")); // ou ";" si besoin
}

function afficherTableDans(containerEl, data) {
    if (!containerEl) return;

    containerEl.innerHTML = "";

    const table = document.createElement("table");
    table.border = "1";

    data.forEach((row, i) => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement(i === 0 ? "th" : "td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    containerEl.appendChild(table);
}

// ---------------------------
// 6) Téléchargement
// ---------------------------
function telechargerCsv(nomFichier, contenuCsv) {
    const blob = new Blob([contenuCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function nomFichierDepuisTitre(form, suffix) {
    const titre = form.querySelector(".poste-title")?.textContent?.trim() || "poste";
    const base = titre.replace(/\s+/g, "_").toLowerCase();
    return `${base}_${suffix}.csv`; // ex: poste_1_poste.csv / poste_1_etapes.csv
}

// ---------------------------
// 7) Events
// ---------------------------

// bouton "Valider" en haut (nombre de postes)
btnValiderPostes.addEventListener("click", () => {
    creerPostes(nbPostesInput.value);
});

// délégation click : Valider étapes / Générer CSV poste / Générer CSV étapes
container.addEventListener("click", async (e) => {
    const form = e.target.closest("form.poste");
    if (!form) return;

    // Valider étapes -> recrée les blocs d'étapes
    if (e.target.classList.contains("btnValiderEtapes")) {
        creerEtapesPour(form);
        return;
    }

    // Générer CSV POSTE (csv / btnGenererCsv)
    if (e.target.classList.contains("btnGenererCsv")) {
        const preview = form.querySelector(".preview");

        const dataPoste = lireDonneesPoste(form);
        const csvText = creerCsvPoste(dataPoste);

        // afficher (optionnel)
        afficherTableDans(preview, parseCsv(csvText));

        // télécharger
        telechargerCsv(nomFichierDepuisTitre(form, "poste"), csvText);
        return;
    }

    // Générer CSV ETAPES (csv2 / btnGenererCsv2)
    if (e.target.classList.contains("btnGenererCsv2")) {
        const preview = form.querySelector(".preview");

        const etapes = lireDonneesEtapes(form);
        const csvText = creerCsvEtapes(etapes);

        // afficher (optionnel)
        afficherTableDans(preview, parseCsv(csvText));

        // télécharger
        telechargerCsv(nomFichierDepuisTitre(form, "etapes"), csvText);
        return;
    }
});

// submit "Valider" dans un poste :
// - si csv (poste) present -> l'affiche
// - si csv2 (étapes) present -> l'affiche
// - sinon -> génère depuis saisie manuelle + télécharge les 2
container.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    if (!form.matches("form.poste")) return;

    const preview = form.querySelector(".preview");
    const filePoste = form.querySelector('input[type="file"][name="csv"]');
    const fileEtapes = form.querySelector('input[type="file"][name="csv2"]');

    // 1) Si au moins un fichier est fourni, on lit et on affiche (priorité aux fichiers)
    if (filePoste?.files?.length) {
        const text = await filePoste.files[0].text();
        afficherTableDans(preview, parseCsv(text));
    }

    if (fileEtapes?.files?.length) {
        const text = await fileEtapes.files[0].text();
        afficherTableDans(preview, parseCsv(text));
    }

    // 2) Si aucun fichier fourni -> on génère les 2 CSV depuis la saisie et on télécharge
    const aucunFichier =
        (!filePoste || filePoste.files.length === 0) &&
        (!fileEtapes || fileEtapes.files.length === 0);

    if (aucunFichier) {
        const dataPoste = lireDonneesPoste(form);
        const etapes = lireDonneesEtapes(form);

        const csvPoste = creerCsvPoste(dataPoste);
        const csvEtapes = creerCsvEtapes(etapes);

        // (optionnel) afficher le CSV poste
        afficherTableDans(preview, parseCsv(csvPoste));

        telechargerCsv(nomFichierDepuisTitre(form, "poste"), csvPoste);
        telechargerCsv(nomFichierDepuisTitre(form, "etapes"), csvEtapes);
    }
});

// ---------------------------
// Init
// ---------------------------
creerPostes(nbPostesInput.value);
