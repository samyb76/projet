<?php
require_once __DIR__ . '/../config/db.php';

$sql = "
SELECT 
  w.workstation_number,
  w.workstation_name,
  w.description,
  w.is_active,
  s.step_number,
  s.standard_time
FROM workstation w
LEFT JOIN step s
  ON s.step_id = (
      SELECT s2.step_id
      FROM step s2
      WHERE s2.workstation_id = w.workstation_id
        AND s2.standard_time IS NOT NULL
      ORDER BY s2.execution_order DESC
      LIMIT 1
  )
ORDER BY w.workstation_number;
";

$stmt = $pdo->prepare($sql);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<main>
    <h1>Home Page</h1>
    <h2>workstation</h2>

    <table border="1" cellpadding="8" cellspacing="0">
        <thead>
            <tr>
                <th>Numero Poste :</th>
                <th>Nom du Poste :</th>
                <th>Description :</th>
                <th>Dernière Etape : </th>
                <th>Temps (s) :</th>
                <th>Active :</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($rows as $row): ?>
                <tr>
                    <td><?= htmlspecialchars($row['workstation_number']) ?></td>
                    <td><?= htmlspecialchars($row['workstation_name']) ?></td>
                    <td><?= htmlspecialchars($row['description']) ?></td>
                    <td><?= htmlspecialchars($row['step_number'] ?? '') ?></td>
                    <td><?= htmlspecialchars($row['standard_time'] ?? '') ?></td>
                    <td style="text-align:center;">
                        <?php $isActive = (int)($row['is_active'] ?? 0); ?>
                        <span class="status-dot <?= $isActive === 1 ? 'green' : 'red' ?>"></span>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</main>