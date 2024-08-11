<?php
require 'db_conn.php';  // Make sure this file contains your database connection details

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$sql = "SELECT headline, link FROM latest_developments ORDER BY created_at DESC LIMIT 10";  // Adjust the LIMIT as needed
$result = $conn->query($sql);

$news = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $news[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($news);
?>