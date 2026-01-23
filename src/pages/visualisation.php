<?php
require_once __DIR__ . '/../config/db.php';
?>
<main>
    <h2>Voulez vous voir :</h2>
    <nav>
        <ul>
            <li><a href="/visualisation-ensemble"> La visualisation d'ensemble</a></li>
            <li><a href="/visualisation-poste">La visualisation d'un poste précis</a></li>
        </ul>
    </nav>
    <h1>CESI BIKE - Steps</h1>

    <h2>Créer une nouvelle étape</h2>
    <form action='/?page=create_step' method='POST'>
        <label for='workstation_id'>Workstation ID:</label>
        <input type='number' id='workstation_id' name='workstation_id' required><br>

        <label for='step_number'>Step number:</label>
        <input type='number' id='step_number' name='step_number' required><br>

        <label for='step_name'>Step name:</label>
        <input type='text' id='step_name' name='step_name' required><br>

        <label for='description'>Description:</label>
        <input type='text' id='description' name='description' required><br>

        <label for='standard_time'>Standard time (mm:ss ou hh:mm:ss):</label>
        <input type='text' id='standard_time' name='standard_time' placeholder='03:20' required><br>

        <label for='execution_order'>Execution order:</label>
        <input type='number' id='execution_order' name='execution_order' required><br>

        <input type='submit' value='Create Step'>
    </form>
</main>