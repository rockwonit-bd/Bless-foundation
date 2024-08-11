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

// Create messages table
$sql = "CREATE TABLE IF NOT EXISTS messages (
    id INT(100) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table messages created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>