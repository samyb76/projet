<?php
session_start();

// Traitement du formulaire pour sauvegarder le nombre de postes
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['nbPostes'])) {
    $_SESSION['nbPostes'] = max(1, intval($_POST['nbPostes']));
}

// Récupérer le nombre de postes depuis la session
$nbPostes = isset($_SESSION['nbPostes']) ? $_SESSION['nbPostes'] : 1;
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Configuration</title>
    <link rel="stylesheet" href="main.css">
</head>

<body>
    <header>
        <h1>CESI BIKE</h1>
        <nav>
            <ul>
                <li><a href="index.php">Accueil</a></li>
                <li><a href="configuration.php" class="active">Configuration</a></li>
                <li><a href="visualisation.php">Visualisation</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section>
            <form method="POST" action="configuration.php">
                <label>
                    Nombre de poste(s)
                    <input id="nbPostes" name="nbPostes" type="number" min="1" value="<?php echo $nbPostes; ?>">
                </label>

                <button id="btnValiderPostes" type="submit">Valider</button>
            </form>
        </section>

        <div id="postesContainer"></div>

        <template id="posteTemplate">
            <form class="poste">
                <h2 class="poste-title"></h2>

                <label>Saisir le nombre d'étapes</label>
                <input class="nbEtapes" name="nbEtape" type="number" min="1" max="10">

                <label>Saisir la liste des pièces</label>
                <input name="listepieces" type="text">

                <label>Saisir le stock de départ</label>
                <input name="stock" type="text">

                <button type="button" class="btnValiderEtapes">Valider étapes</button>
                <input name="csv" type="file" accept=".csv">
                <button type="button" class="btnGenererCsv">Générer CSV</button>

                <div class="etapesContainer"></div>

                <input name="csv2" type="file" accept=".csv">
                <button type="button" class="btnGenererCsv2">Générer CSV</button>
                <input type="submit" value="Valider">
                <input type="reset" value="Réinitialiser">

                <div class="preview"></div>
                <hr>
            </form>
        </template>

        <template id="etapeTemplate">
            <div class="etape">
                <h4 class="etape-title"></h4>

                <label>Liste des pièces utilisées</label>
                <input name="piecesUtilisees" type="text">

                <label>Nombre de pièces utilisées</label>
                <input name="nbPieces" type="text" min="1">

                <hr>
            </div>
        </template>

        <div id="csvOutput"></div>
    </main>

    <footer>
        <p>© 2026 - CESI BIKE. Tous droits réservés.</p>
    </footer>

    <script src="script.js"></script>
</body>

</html>