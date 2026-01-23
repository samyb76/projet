<?php
require_once __DIR__ . '/../config/db.php';

$sql = "SELECT * FROM workstation;";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$workstations = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<main>
    <h1>Home Page</h1>
    <h2>workstation</h2>
    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th>Numero Poste</th>
                <th>Nom du Poste</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($workstations as $workstation): ?>
                <tr>
                    <td><?= htmlspecialchars($workstation['workstation_number']) ?></td>
                    <td><?= htmlspecialchars($workstation['workstation_name']) ?></td>
                    <td><?= htmlspecialchars($workstation['description']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</main>