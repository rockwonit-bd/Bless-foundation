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
$sql = "CREATE TABLE IF NOT EXISTS contact_us_content (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    office_address_en TEXT NOT NULL,
    office_address_bn TEXT NOT NULL,
    google_map_embed_link TEXT NOT NULL,
    ngo_member_info_en TEXT NOT NULL,
    ngo_member_info_bn TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Table contact_us_content created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();
?>