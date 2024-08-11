<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch projects
$sql = "SELECT id, title_en, title_bn, short_desc_en, short_desc_bn, detailed_desc_en, detailed_desc_bn, image_path FROM projects";
$result = $conn->query($sql);

$projects = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $projects[] = $row;
    }
}

// Return JSON encoded projects
echo json_encode($projects);

$conn->close();
?>