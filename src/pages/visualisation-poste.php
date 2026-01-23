<?php
require_once __DIR__ . '/../config/db.php';
$sql = "SELECT workstation_id, part_id, available_quantity FROM workstation_stock;";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$workstation_stocks = $stmt->fetchAll(PDO::FETCH_ASSOC);

$sql = "SELECT workstation_id, step_number, standard_time FROM step;";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$steps = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Regrouper le stock par poste
$stockByWs = [];
foreach ($workstation_stocks as $row) {
    $wsId = (int)$row['workstation_id'];
    $stockByWs[$wsId][] = $row;
}

// Regrouper les étapes par poste
$stepsByWs = [];
foreach ($steps as $row) {
    $wsId = (int)$row['workstation_id'];
    $stepsByWs[$wsId][] = $row;
}

// Liste de tous les postes (union des postes présents dans stock + steps)
$workstationIds = array_unique(array_merge(array_keys($stockByWs), array_keys($stepsByWs)));
sort($workstationIds);
?>

<main class="poste-page">
    <?php foreach ($workstationIds as $wsId): ?>
        <section class="poste">
            <h1>Poste <?= htmlspecialchars($wsId) ?></h1>

            <h2>État du stock</h2>
            <table border="1" cellpadding="8" cellspacing="0">
                <thead>
                    <tr>
                        <th>Pièce</th>
                        <th>Quantité</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $stock = $stockByWs[$wsId] ?? []; ?>
                    <?php if (empty($stock)): ?>
                        <tr>
                            <td colspan="2">Aucun stock</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($stock as $s): ?>
                            <tr>
                                <td><?= htmlspecialchars($s['part_id']) ?></td>
                                <td><?= htmlspecialchars($s['available_quantity']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>

            <h2>Temps par étape</h2>
            <table border="1" cellpadding="8" cellspacing="0">
                <thead>
                    <tr>
                        <th>Étape</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $wsSteps = $stepsByWs[$wsId] ?? []; ?>
                    <?php if (empty($wsSteps)): ?>
                        <tr>
                            <td colspan="2">Aucune étape</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($wsSteps as $st): ?>
                            <tr>
                                <td>Étape <?= htmlspecialchars($st['step_number']) ?></td>
                                <td><?= htmlspecialchars($st['standard_time']) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </section>
    <?php endforeach; ?>
</main>