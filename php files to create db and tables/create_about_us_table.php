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

// SQL to create about_us table
$sql = "CREATE TABLE IF NOT EXISTS about_us (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content_en TEXT NOT NULL,
    content_bn TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table about_us created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

// Insert initial empty content
$sql = "INSERT INTO about_us (content_en, content_bn) VALUES ('', '') 
        ON DUPLICATE KEY UPDATE id = id";

if ($conn->query($sql) === TRUE) {
    echo "Initial content added successfully";
} else {
    echo "Error adding initial content: " . $conn->error;
}

$conn->close();
?>