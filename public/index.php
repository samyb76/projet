<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Récupération de l'URL
$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Page par défaut
$page = $uri === '' ? 'acceuil.php' : $uri;

// Sécurité basique
$page = basename($page);

// Chemin vers la page (remonter d'un niveau depuis public/)
$pagePath = __DIR__ . "/../src/pages/$page.php";

// Header & navbar
require __DIR__ . '/../src/components/header.php';
require __DIR__ . '/../src/components/navbar.php';

// Chargement de la page
if (file_exists($pagePath)) {
    require $pagePath;
} else {
    require __DIR__ . '/../src/pages/404.php';
}

// Footer
require __DIR__ . '/../src/components/footer.php';
