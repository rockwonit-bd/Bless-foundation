<?php
header('Content-Type: application/json');

require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $organization = $_POST['organization'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO messages (name, organization, phone, email, message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $organization, $phone, $email, $message);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(["success" => "Message sent successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>