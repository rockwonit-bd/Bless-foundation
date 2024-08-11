<?php
header('Content-Type: application/json');
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Function to fetch all Bangladeshi volunteers
function getBangladeshiVolunteers() {
    global $conn;
    $sql = "SELECT id, first_name, last_name, email, phone FROM volunteer_bn ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $volunteers = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $volunteers[] = $row;
        }
    }
    return $volunteers;
}

// Function to get a single volunteer's details
function getVolunteerDetails($id) {
    global $conn;
    $sql = "SELECT * FROM volunteer_bn WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return null;
}

// Function to delete a volunteer
function deleteVolunteer($id) {
    global $conn;

    // First, get the image paths
    $sql = "SELECT image_path_bn, identity_path_bn FROM volunteer_bn WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $volunteer = $result->fetch_assoc();

    // Delete the database entry
    $sql = "DELETE FROM volunteer_bn WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // If database deletion was successful, delete the image files
        if ($volunteer) {
            if (file_exists($volunteer['image_path_bn'])) {
                unlink($volunteer['image_path_bn']);
            }
            if (file_exists($volunteer['identity_path_bn'])) {
                unlink($volunteer['identity_path_bn']);
            }
        }
        return true;
    }
    return false;
}

// Main logic to handle different operations
// Main logic to handle different operations
$action = $_SERVER['REQUEST_METHOD'] === 'POST' ? json_decode(file_get_contents('php://input'), true)['action'] : ($_GET['action'] ?? '');

switch ($action) {
    case 'getAll':
        echo json_encode(['success' => true, 'volunteers' => getBangladeshiVolunteers()]);
        break;
    case 'getDetails':
        $id = $_SERVER['REQUEST_METHOD'] === 'POST' ? json_decode(file_get_contents('php://input'), true)['id'] : ($_GET['id'] ?? 0);
        $details = getVolunteerDetails($id);
        if ($details) {
            echo json_encode(['success' => true, 'volunteer' => $details]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Volunteer not found']);
        }
        break;
    case 'delete':
        $id = json_decode(file_get_contents('php://input'), true)['id'] ?? 0;
        if (deleteVolunteer($id)) {
            echo json_encode(['success' => true, 'message' => 'Volunteer deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete volunteer']);
        }
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

$conn->close();
?>