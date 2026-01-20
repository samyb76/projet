
const nbPostesInput = document.getElementById("nbPostes");
const postes = Array.from(document.querySelectorAll(".poste"));
const btnValider = document.getElementById("btnValiderPostes");
const btnReset = document.getElementById("btnResetPostes");

const container = document.getElementById("postesContainer");
const template = document.getElementById("posteTemplate");

function renderPostes(nombre) {
    container.innerHTML = "";

    nombre = parseInt(nombre, 10);
    if (Number.isNaN(nombre) || nombre < 0) nombre = 0;

    for (let i = 1; i <= nombre; i++) {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".poste-title").textContent = `Poste ${i}`;

        container.appendChild(clone);
    }
}

btnValider.addEventListener("click", () => {
    renderPostes(nbPostesInput.value);
});

btnReset.addEventListener("click", () => {
    nbPostesInput.value = 1;
    renderPostes(1);
});

// affichage initial
renderPostes(nbPostesInput.value);
