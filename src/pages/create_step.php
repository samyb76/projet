<?php
ini_set('display_errors', 'On');

$workstation_id  = (int)($_POST['workstation_id'] ?? 0);
$step_number     = (int)($_POST['step_number'] ?? 0);
$step_name       = trim($_POST['step_name'] ?? '');
$description     = trim($_POST['description'] ?? '');
$standard_time   = trim($_POST['standard_time'] ?? '');
$execution_order = (int)($_POST['execution_order'] ?? 0);

$user = 'viann';
$pass = 'azerty12345';

$pdo = new PDO('mysql:host=localhost;dbname=CesiBike;charset=utf8mb4', $user, $pass,);

$sth = $dbh->query('INSERT INTO step (workstation_id, step_numbe, step_name, description, standard_time, execution_order) VALUES ("' .
    $workstation_id . '", ' .
    $step_number . ', ' .
    $step_name . ', ' .
    $description . ', ' .
    $standard_time . ', ' .
    $execution_order . ');');

$sth = null;
$dbh = null;
header('Location: visualisation.php');
exit();
