<?php
$conn = new mysqli("localhost", "root", "", "users_db");

if ($conn->connect_error) {
    die("Błąd połączenia z bazą danych: " . $conn->connect_error);
}
?>