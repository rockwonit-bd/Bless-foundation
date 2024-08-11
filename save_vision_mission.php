<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input data
    $visionEn = $conn->real_escape_string($_POST['visionEn']);
    $visionBn = $conn->real_escape_string($_POST['visionBn']);
    $missionEn = $conn->real_escape_string($_POST['missionEn']);
    $missionBn = $conn->real_escape_string($_POST['missionBn']);

    // Check if a record already exists
    $checkSql = "SELECT COUNT(*) as count FROM vision_mission";
    $result = $conn->query($checkSql);
    $row = $result->fetch_assoc();
    $count = $row['count'];

    if ($count > 0) {
        // Update existing record
        $sql = "UPDATE vision_mission SET 
                vision_en = '$visionEn', 
                vision_bn = '$visionBn', 
                mission_en = '$missionEn', 
                mission_bn = '$missionBn'";
    } else {
        // Insert new record
        $sql = "INSERT INTO vision_mission (vision_en, vision_bn, mission_en, mission_bn) 
                VALUES ('$visionEn', '$visionBn', '$missionEn', '$missionBn')";
    }

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Vision and Mission updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>