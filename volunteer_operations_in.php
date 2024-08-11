<?php
header('Content-Type: application/json');
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Function to fetch all international volunteers
function getInternationalVolunteers() {
    global $conn;
    $sql = "SELECT id, first_name, last_name, email, country FROM volunteer_in ORDER BY created_at DESC";
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
    $sql = "SELECT * FROM volunteer_in WHERE id = ?";
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
    $sql = "SELECT identity, picture FROM volunteer_in WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $volunteer = $result->fetch_assoc();

    // Delete the database entry
    $sql = "DELETE FROM volunteer_in WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // If database deletion was successful, delete the image files
        if ($volunteer) {
            if (file_exists($volunteer['identity'])) {
                unlink( $volunteer['identity']);
            }
            if (file_exists($volunteer['picture'])) {
                unlink($volunteer['picture']);
            }
        }
        return true;
    }
    return false;
}

// Main logic to handle different operations
$action = $_SERVER['REQUEST_METHOD'] === 'POST' ? json_decode(file_get_contents('php://input'), true)['action'] : ($_GET['action'] ?? '');

switch ($action) {
    case 'getAll':
        echo json_encode(['success' => true, 'volunteers' => getInternationalVolunteers()]);
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