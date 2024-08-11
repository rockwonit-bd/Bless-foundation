<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL to retrieve data
$sql = "SELECT * FROM vision_mission LIMIT 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        "success" => true,
        "data" => [
            "visionEn" => $row["vision_en"],
            "visionBn" => $row["vision_bn"],
            "missionEn" => $row["mission_en"],
            "missionBn" => $row["mission_bn"]
        ]
    ]);
} else {
    echo json_encode(["success" => false, "message" => "No data found"]);
}

$conn->close();
?>