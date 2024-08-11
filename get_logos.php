<?php
session_start();
// Database connection
require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT position, image_path FROM logos";
$result = $conn->query($sql);

$logos = array('top' => '', 'bottom' => '');

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $logos[$row['position']] = $row['image_path'];
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($logos);
?>