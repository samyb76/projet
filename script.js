// ===========================
// Helpers communs
// ===========================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const toInt = (v, def = 1) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 1 ? n : def;
};

const slug = (s) => (s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

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

    btnValider.addEventListener("click", () => creerPostes(nbPostesInput.value));

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

    creerPostes(nbPostesInput.value);
})();

// ===========================
// INIT 2 : Page VISUALISATION (tableau)
// ===========================
(function initVisuTable() {
    const nbInput = $("#nbPostesVisu");
    const btn = $("#btnValiderVisu");
    const tbody = $("#visuBody");
    const tpl = $("#lignePosteTpl");

    if (!nbInput || !btn || !tbody || !tpl) return;

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

    btn.addEventListener("click", () => render(nbInput.value));
    render(nbInput.value);
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

    if (!nbInput || !btn || !nav || !container || !tpl) return;

    const pieces = ["Vis M3", "Rondelle", "Moteur", "Capteur", "Cable", "LED", "PCB", "Axe", "Ecrou"];
    const pick = () => pieces[Math.floor(Math.random() * pieces.length)];
    const rndTime = () => `${String(Math.floor(Math.random() * 9) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`;

    const fakeStock = () => ([
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 },
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 },
        { piece: pick(), qte: Math.floor(Math.random() * 200) + 1 }
    ]);

    const fakeTemps = () => {
        const nbEtapes = Math.floor(Math.random() * 5) + 5; // 5..9
        return Array.from({ length: nbEtapes }, (_, i) => ({
            etape: i + 1,
            t: [rndTime(), rndTime(), rndTime(), rndTime(), rndTime()]
        }));
    };

    function render(n) {
        n = toInt(n, 1);

        // nav
        nav.innerHTML = "";
        for (let i = 1; i <= n; i++) {
            nav.insertAdjacentHTML("beforeend", `<li><a href="#poste${i}">Poste ${i}</a></li>`);
        }

        // sections
        container.innerHTML = "";
        for (let i = 1; i <= n; i++) {
            const clone = tpl.content.cloneNode(true);
            const section = clone.querySelector("section.posteDetails");

            section.id = `poste${i}`;
            section.querySelector(".posteTitle").textContent = `Poste ${i}`;

            // stock
            const stockBody = section.querySelector(".stockBody");
            stockBody.innerHTML = fakeStock()
                .map(r => `<tr><td>${r.piece}</td><td>${r.qte}</td></tr>`)
                .join("");

            // temps
            const tempsBody = section.querySelector(".tempsBody");
            tempsBody.innerHTML = fakeTemps()
                .map(e => `
          <tr>
            <td>Étape ${e.etape}</td>
            <td>${e.t[0]}</td>
            <td>${e.t[1]}</td>
            <td>${e.t[2]}</td>
            <td>${e.t[3]}</td>
            <td>${e.t[4]}</td>
          </tr>
        `)
                .join("");

            container.appendChild(clone);
        }
    }

    btn.addEventListener("click", () => render(nbInput.value));
    render(nbInput.value);
})();
