<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "bless_foundation";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to create table
$sql = "CREATE TABLE IF NOT EXISTS vision_mission (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    vision_en TEXT NOT NULL,
    vision_bn TEXT NOT NULL,
    mission_en TEXT NOT NULL,
    mission_bn TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table vision_mission created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>