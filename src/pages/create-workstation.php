<?php
require_once __DIR__ . '/../config/db.php';

// Récupération et nettoyage des données
$workstation_number = (int)($_POST['workstation_number'] ?? 0);
$workstation_name   = trim($_POST['workstation_name'] ?? '');
$description        = trim($_POST['description'] ?? '');
$model_id           = (int)($_POST['model_id'] ?? 0);
$is_active          = (int)($_POST['is_active'] ?? 0);

// Vérification minimale
if (
    $workstation_number <= 0 ||
    empty($workstation_name) ||
    $model_id <= 0
) {
    die('Données invalides');
}

// Requête SQL préparée
$sql = "
    INSERT INTO workstation (
        workstation_number,
        workstation_name,
        description,
        model_id,
        is_active
    ) VALUES (
        :workstation_number,
        :workstation_name,
        :description,
        :model_id,
        :is_active
    )
";

// Préparation
$stmt = $pdo->prepare($sql);

// Exécution
$stmt->execute([
    ':workstation_number' => $workstation_number,
    ':workstation_name'   => $workstation_name,
    ':description'        => $description,
    ':model_id'           => $model_id,
    ':is_active'          => $is_active
]);

header('Location: /home');
