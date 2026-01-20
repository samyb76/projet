// Sélecteurs
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const nbPostesInput = $("#nbPostes");
const btnValiderPostes = $("#btnValiderPostes");
const container = $("#postesContainer");
const posteTemplate = $("#posteTemplate");
const etapeTemplate = $("#etapeTemplate");

// Helpers
const toInt = (v, def = 1) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 ? n : def;
};

const posteBaseName = (form) =>
    ($(".poste-title", form)?.textContent?.trim() || "poste")
        .replace(/\s+/g, "_")
        .toLowerCase();

function telechargerCsv(nomFichier, contenuCsv) {
    const blob = new Blob([contenuCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// génère un CSV depuis un header + des lignes
function makeCsv(header, rows) {
    return [header.join(","), ...rows.map(r => r.join(","))].join("\n");
}

// Création UI
function creerEtapesPour(form) {
    const n = toInt($(".nbEtapes", form)?.value, 1);
    const etapesContainer = $(".etapesContainer", form);
    etapesContainer.innerHTML = "";

    for (let i = 1; i <= n; i++) {
        const clone = etapeTemplate.content.cloneNode(true);
        $(".etape-title", clone).textContent = `Étape ${i}`;
        etapesContainer.appendChild(clone);
    }
}

function creerPostes(n) {
    container.innerHTML = "";
    n = toInt(n, 1);

    for (let i = 1; i <= n; i++) {
        const clone = posteTemplate.content.cloneNode(true);
        const form = $("form.poste", clone);

        $(".poste-title", form).textContent = `Poste ${i}`;
        const nbEtapes = $(".nbEtapes", form);
        if (!nbEtapes.value) nbEtapes.value = 1;

        creerEtapesPour(form);
        container.appendChild(clone);
    }
}

// Lecture données
function lirePoste(form) {
    return [
        $('[name="nbEtape"]', form).value,
        $('[name="listepieces"]', form).value,
        $('[name="stock"]', form).value
    ];
}

function lireEtapes(form) {
    return $$(".etape", form).map((etapeEl, i) => ([
        String(i + 1),
        $('[name="piecesUtilisees"]', etapeEl)?.value ?? "",
        $('[name="nbPieces"]', etapeEl)?.value ?? ""
    ]));
}

// Events
btnValiderPostes.addEventListener("click", () => {
    creerPostes(nbPostesInput.value);
});

container.addEventListener("click", (e) => {
    const form = e.target.closest("form.poste");
    if (!form) return;

    // Valider étapes
    if (e.target.classList.contains("btnValiderEtapes")) {
        creerEtapesPour(form);
        return;
    }

    // CSV Poste
    if (e.target.classList.contains("btnGenererCsv")) {
        const csv = makeCsv(
            ["nbEtapes", "listepieces", "stock"],
            [lirePoste(form)]
        );
        telechargerCsv(`${posteBaseName(form)}_stock.csv`, csv);
        return;
    }

    // CSV Étapes
    if (e.target.classList.contains("btnGenererCsv2")) {
        const csv = makeCsv(
            ["etape", "piecesUtilisees", "nbPieces"],
            lireEtapes(form)
        );
        telechargerCsv(`${posteBaseName(form)}_Etape.csv`, csv);
        return;
    }
});

// submit (tu ajouteras plus tard)
container.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.matches("form.poste")) return;

    // action à ajouter plus tard
});

// Init
creerPostes(nbPostesInput.value);
