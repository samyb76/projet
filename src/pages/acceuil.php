<?php
session_start();

// Initialiser le nombre de postes si pas défini
if (!isset($_SESSION['nbPostes'])) {
    $_SESSION['nbPostes'] = 1;
}
?>
<!DOCTYPE html>
<html lang="fr">



<body>
    <header>
        <h1>CESI BIKE</h1>

    </header>

    <main>
        <section>
            <h2>Informations sur la configuration des postes</h2>
            <p>Ceci est un exemple de page HTML avec une structure de base comprenant un en-tête, une navigation et un
                contenu principal.</p>
        </section>
    </main>



</body>

</html>