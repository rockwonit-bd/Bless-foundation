<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle different actions
$action = $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        addLatestDevelopment($conn);
        break;
    case 'get':
        getLatestDevelopments($conn);
        break;
    case 'edit':
        editLatestDevelopment($conn);
        break;
    case 'delete':
        deleteLatestDevelopment($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function addLatestDevelopment($conn) {
    $headline = $conn->real_escape_string($_POST['headline']);
    $link = $conn->real_escape_string($_POST['link']);

    $sql = "INSERT INTO latest_developments (headline, link) VALUES ('$headline', '$link')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Development added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error adding development: ' . $conn->error]);
    }
}

function getLatestDevelopments($conn) {
    $sql = "SELECT * FROM latest_developments ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $developments = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $developments[] = $row;
        }
    }

    echo json_encode(['success' => true, 'developments' => $developments]);
}

function editLatestDevelopment($conn) {
    $id = $conn->real_escape_string($_POST['id']);
    $headline = $conn->real_escape_string($_POST['headline']);
    $link = $conn->real_escape_string($_POST['link']);

    $sql = "UPDATE latest_developments SET headline = '$headline', link = '$link' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Development updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating development: ' . $conn->error]);
    }
}

function deleteLatestDevelopment($conn) {
    $id = $conn->real_escape_string($_POST['id']);

    $sql = "DELETE FROM latest_developments WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Development deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error deleting development: ' . $conn->error]);
    }
}

$conn->close();
?>