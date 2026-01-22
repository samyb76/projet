
// ===========================
// Helpers communs
// ===========================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const KEY_NB_POSTES = "nbPostes";

const toInt = (v, def = 1) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 ? n : def;
};

const slug = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, "_");

function telechargerCsv(filename, csvText) {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function makeCsv(header, rows) {
    return [header.join(","), ...rows.map(r => r.join(","))].join("\n");
}

function getSavedNb(def = 1) {
    return toInt(localStorage.getItem(KEY_NB_POSTES), def);
}

function setSavedNb(n) {
    localStorage.setItem(KEY_NB_POSTES, String(n));
}

// ===========================
// INIT 1 : Page CONFIGURATION
// ===========================
(function initConfig() {
    const nbPostesInput = $("#nbPostes");
    const btnValider = $("#btnValiderPostes");
    const container = $("#postesContainer");
    const posteTpl = $("#posteTemplate");
    const etapeTpl = $("#etapeTemplate");

    if (!nbPostesInput || !btnValider || !container || !posteTpl || !etapeTpl) return;

    const posteBaseName = (form) => slug($(".poste-title", form)?.textContent || "poste");

    function creerEtapes(form) {
        const n = toInt($(".nbEtapes", form)?.value, 1);
        const c = $(".etapesContainer", form);
        c.innerHTML = "";

        for (let i = 1; i <= n; i++) {
            const clone = etapeTpl.content.cloneNode(true);
            $(".etape-title", clone).textContent = `Étape ${i}`;
            c.appendChild(clone);
        }
    }

    function creerPostes(n) {
        container.innerHTML = "";
        n = toInt(n, 1);

        for (let i = 1; i <= n; i++) {
            const clone = posteTpl.content.cloneNode(true);
            const form = $("form.poste", clone);

            $(".poste-title", form).textContent = `Poste ${i}`;
            const nbEtapes = $(".nbEtapes", form);
            if (!nbEtapes.value) nbEtapes.value = 1;

            creerEtapes(form);
            container.appendChild(clone);
        }
    }

    const lirePoste = (form) => ([
        $('[name="nbEtape"]', form).value,
        $('[name="listepieces"]', form).value,
        $('[name="stock"]', form).value
    ]);

    const lireEtapes = (form) => $$(".etape", form).map((etapeEl, i) => ([
        String(i + 1),
        $('[name="piecesUtilisees"]', etapeEl)?.value ?? "",
        $('[name="nbPieces"]', etapeEl)?.value ?? ""
    ]));

    // bouton "Valider postes" : sauvegarde + regen
    btnValider.addEventListener("click", () => {
        const n = toInt(nbPostesInput.value, 1);
        setSavedNb(n);
        creerPostes(n);
    });

    // actions dans les postes
    container.addEventListener("click", (e) => {
        const form = e.target.closest("form.poste");
        if (!form) return;

        if (e.target.classList.contains("btnValiderEtapes")) {
            creerEtapes(form);
            return;
        }

        if (e.target.classList.contains("btnGenererCsv")) {
            const csv = makeCsv(["nbEtapes", "listepieces", "stock"], [lirePoste(form)]);
            telechargerCsv(`${posteBaseName(form)}_stock.csv`, csv);
            return;
        }

        if (e.target.classList.contains("btnGenererCsv2")) {
            const csv = makeCsv(["etape", "piecesUtilisees", "nbPieces"], lireEtapes(form));
            telechargerCsv(`${posteBaseName(form)}_etapes.csv`, csv);
            return;
        }
    });

    container.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!e.target.matches("form.poste")) return;
        // action à ajouter plus tard
    });

    // init : prend la valeur sauvegardée si elle existe
    const saved = getSavedNb(toInt(nbPostesInput.value, 1));
    nbPostesInput.value = saved;
    creerPostes(saved);
})();

// ===========================
// INIT 2 : Page VISUALISATION (tableau)
// ===========================
(function initVisuTable() {
    const nbInput = $("#nbPostesVisu");
    const btn = $("#btnValiderVisu");
    const tbody = $("#visuBody");
    const tpl = $("#lignePosteTpl");

    if (!tbody || !tpl) return;

    const fakeData = () => ({
        stock: Math.floor(Math.random() * 101),
        etape: Math.floor(Math.random() * 6) + 1,
        temps: `${String(Math.floor(Math.random() * 10)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
    });

    function render(n) {
        tbody.innerHTML = "";
        n = toInt(n, 1);

        for (let i = 1; i <= n; i++) {
            const clone = tpl.content.cloneNode(true);
            const tr = clone.querySelector("tr");
            const d = fakeData();

            tr.querySelector(".posteCell").textContent = `Poste ${i}`;
            tr.querySelector(".stockBar").value = d.stock;
            tr.querySelector(".stockTxt").textContent = `${d.stock}%`;
            tr.querySelector(".etapeCell").textContent = `Étape ${d.etape}`;
            tr.querySelector(".tempsCell").textContent = d.temps;

            tbody.appendChild(clone);
        }
    }

    // init depuis localStorage
    const saved = getSavedNb(6);
    if (nbInput) nbInput.value = saved;
    render(saved);

    // si tu gardes input+bouton sur cette page
    if (btn && nbInput) {
        btn.addEventListener("click", () => {
            const n = toInt(nbInput.value, 1);
            setSavedNb(n); // optionnel: garder synchro
            render(n);
        });
    }
})();

// ===========================
// INIT 3 : Page VISUALISATION (détails par poste)
// ===========================
(function initVisuDetails() {
    const nbInput = $("#nbPostesDetails");
    const btn = $("#btnValiderDetails");
    const nav = $("#navPostes");
    const container = $("#postesDetailsContainer");
    const tpl = $("#posteDetailsTpl");

    if (!nav || !container || !tpl) return;

    const pieces = ["Vis M3", "Rondelle", "Moteur", "Capteur", "Cable", "LED", "PCB", "Axe", "Ecrou"];
    const pick = () => pieces[Math.floor(Math.random() * pieces.length)];
    const rndTime = () => `${String(Math.floor(Math.random() * 9) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;

    const fakeStock = () => ([
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 },
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 },
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 }
    ]);

    const fakeTemps = () => {
        const nbEtapes = Math.floor(Math.random() * 5) + 5;
        return Array.from({ length: nbEtapes }, (_, i) => ({
            etape: i + 1,
            t: [rndTime(), rndTime(), rndTime(), rndTime(), rndTime()]
        }));
    };

    function render(n) {
        n = toInt(n, 1);

        nav.innerHTML = "";
        container.innerHTML = "";

        for (let i = 1; i <= n; i++) {
            nav.insertAdjacentHTML("beforeend", `<li><a href="#poste${i}">Poste ${i}</a></li>`);

            const clone = tpl.content.cloneNode(true);
            const section = clone.querySelector("section.posteDetails");

            section.id = `poste${i}`;
            section.querySelector(".posteTitle").textContent = `Poste ${i}`;

            section.querySelector(".stockBody").innerHTML = fakeStock()
                .map(r => `<tr><td>${r.piece}</td><td>${r.qte}</td></tr>`)
                .join("");

            section.querySelector(".tempsBody").innerHTML = fakeTemps()
                .map(e => `
          <tr>
            <td>Étape ${e.etape}</td>
            <td>${e.t[0]}</td>
            <td>${e.t[1]}</td>
            <td>${e.t[2]}</td>
            <td>${e.t[3]}</td>
            <td>${e.t[4]}</td>
          </tr>
        `).join("");

            container.appendChild(clone);
        }
    }

    // init depuis localStorage
    const saved = getSavedNb(6);
    if (nbInput) nbInput.value = saved;
    render(saved);

    // si tu gardes input+bouton sur cette page
    if (btn && nbInput) {
        btn.addEventListener("click", () => {
            const n = toInt(nbInput.value, 1);
            setSavedNb(n); // optionnel
            render(n);
        });
    }
})();
