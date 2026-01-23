<?php
require_once __DIR__ . '/../config/db.php';

$workstation_id  = (int)($_POST['workstation_id'] ?? 0);
$step_number     = (int)($_POST['step_number'] ?? 0);
$step_name       = trim($_POST['step_name'] ?? '');
$description     = trim($_POST['description'] ?? '');
$standard_time   = trim($_POST['standard_time'] ?? '');
$execution_order = (int)($_POST['execution_order'] ?? 0);

// Vérification minimale (adaptée à tes variables)
if (
    $workstation_id <= 0 ||
    $step_number <= 0 ||
    $step_name === '' ||
    $execution_order <= 0
) {
    die('Données invalides');
}

// Requête SQL préparée
$sql = "
    INSERT INTO step (
        workstation_id,
        step_number,
        step_name,
        description,
        standard_time,
        execution_order
    ) VALUES (
        :workstation_id,
        :step_number,
        :step_name,
        :description,
        :standard_time,
        :execution_order
    )
";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ':workstation_id'  => $workstation_id,
    ':step_number'     => $step_number,
    ':step_name'       => $step_name,
    ':description'     => $description,
    ':standard_time'   => $standard_time,
    ':execution_order' => $execution_order
]);

header('Location: /visualisation_poste');
