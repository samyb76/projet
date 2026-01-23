<?php
require_once __DIR__ . '/../config/db.php';
?>
<main>
    <form action="create-workstation" method="post">

        <label for='workstation_number'>workstation number:</label>
        <input type='number' id='workstation_number' name='workstation_number' required><br>

        <label for='workstation_name'>workstation name:</label>
        <input type='text' id='workstation_name' name='workstation_name' required><br>

        <label for='description'>Description:</label>
        <input type='text' id='description' name='description' required><br>

        <input type="hidden" name="model_id" value="1">
        <input type="hidden" name="is_active" value="1">


        <input type='submit' value='Create workstation'>
    </form>
</main>