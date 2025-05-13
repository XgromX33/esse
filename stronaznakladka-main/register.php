<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
session_start();
require_once('db.php');

$login = $_POST['login'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$login || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Brakuje danych']);
    exit;
}

// Sprawdź, czy użytkownik już istnieje
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd SQL przy SELECT: ' . $conn->error]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'E-mail już istnieje']);
    exit;
}

// Dodaj nowego użytkownika
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (login, email, password) VALUES (?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd SQL przy INSERT: ' . $conn->error]);
    exit;
}
$stmt->bind_param("sss", $login, $email, $hashed);

if ($stmt->execute()) {
    $_SESSION['email'] = $email;
    echo json_encode([
        'user' => ['login' => $login, 'email' => $email],
        'token' => session_id()
    ]);
    exit;
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Nie udało się dodać użytkownika']);
    exit;
}
?>