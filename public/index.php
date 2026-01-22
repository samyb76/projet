<?php
session_start();

// Initialiser le nombre de postes si pas défini
if (!isset($_SESSION['nbPostes'])) {
    $_SESSION['nbPostes'] = 1;
}
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Accueil</title>
    <link rel="stylesheet" href="main.css">
</head>

<body>
    <header>
        <h1>CESI BIKE</h1>
        <nav>
            <ul>
                <li><a href="index.php" class="active">Accueil</a></li>
                <li><a href="configuration.php">Configuration des postes</a></li>
                <li><a href="visualisation.php">Visualisation</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Informations sur la configuration des postes</h2>
            <p>Ceci est un exemple de page HTML avec une structure de base comprenant un en-tête, une navigation et un
                contenu principal.</p>
        </section>
    </main>

    <footer>
        <p>© 2026 - CESI BIKE. Tous droits réservés.</p>
    </footer>

</body>

</html>