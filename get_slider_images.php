<?php
require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch slider images
$sql = "SELECT id, image_path, caption FROM image_slider ORDER BY id ASC";
$result = $conn->query($sql);

$sliderImages = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $sliderImages[] = $row;
    }
}

$conn->close();

// Return JSON encoded data
header('Content-Type: application/json');
echo json_encode($sliderImages);
?>