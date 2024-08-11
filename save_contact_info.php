<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone = $_POST['phone'];
    $email = $_POST['email'];

    // Check if a record already exists
    $check_sql = "SELECT * FROM contact_info LIMIT 1";
    $result = $conn->query($check_sql);

    if ($result->num_rows > 0) {
        // Update existing record
        $sql = "UPDATE contact_info SET phone = ?, email = ? WHERE id = 1";
    } else {
        // Insert new record
        $sql = "INSERT INTO contact_info (phone, email) VALUES (?, ?)";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $phone, $email);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Contact info updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating contact info: " . $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}

$conn->close();
?>