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

// Create logo table
$sql = "CREATE TABLE IF NOT EXISTS logos (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    position ENUM('top', 'bottom') NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table logos created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Create latest_developments table
$sql = "CREATE TABLE IF NOT EXISTS latest_developments (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    headline VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table latest_developments created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Create image_slider table
$sql = "CREATE TABLE IF NOT EXISTS image_slider (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table image_slider created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Create motivating_tales table
$sql = "CREATE TABLE IF NOT EXISTS motivating_tales (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table motivating_tales created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Create contact_info table
$sql = "CREATE TABLE IF NOT EXISTS contact_info (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table contact_info created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

$conn->close();
?>