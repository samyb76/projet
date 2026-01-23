<?php
require_once __DIR__ . '/../config/db.php';

$sql = "SELECT s.workstation_id,
       s.step_number,
       s.step_name,
       s.standard_time,
       s.execution_order
FROM step s
INNER JOIN (
    SELECT workstation_id, MAX(execution_order) AS max_order
    FROM step
    GROUP BY workstation_id
) last_step
ON s.workstation_id = last_step.workstation_id
AND s.execution_order = last_step.max_order
ORDER BY s.workstation_id;";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$steps = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<main>
    <h2>Visualisation d'ensemble</h2>
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th>ID Poste</th>
                <th>Numéro d'étape</th>
                <th>Nom de l'étape</th>
                <th>Temps</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($steps as $step): ?>
                <tr>
                    <td><?= htmlspecialchars($step['workstation_id']) ?></td>
                    <td><?= htmlspecialchars($step['step_number']) ?></td>
                    <td><?= htmlspecialchars($step['step_name']) ?></td>
                    <td><?= htmlspecialchars($step['standard_time']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</main>