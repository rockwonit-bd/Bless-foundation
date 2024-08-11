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

// SQL to create projects table
$sql = "CREATE TABLE IF NOT EXISTS projects (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    short_desc_en TEXT,
    short_desc_bn TEXT,
    detailed_desc_en TEXT,
    detailed_desc_bn TEXT,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table projects created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>