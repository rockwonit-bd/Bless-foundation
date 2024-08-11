<?php
// Database connection
require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch motivating tales from the database
$sql = "SELECT id, image_path, description_en, description_bn FROM motivating_tales";
$result = $conn->query($sql);

$tales = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tales[] = $row;
    }
}

// Close the database connection
$conn->close();

// Return the data as JSON
header('Content-Type: application/json');
echo json_encode($tales);
?>