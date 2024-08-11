<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// Handle different operations based on the request method
$request_method = $_SERVER['REQUEST_METHOD'];

switch ($request_method) {
    case 'GET':
        // Fetch all messages
        $sql = "SELECT id, name, email, created_at FROM messages ORDER BY created_at DESC";
        $result = $conn->query($sql);

        if ($result) {
            $messages = [];
            while ($row = $result->fetch_assoc()) {
                $messages[] = $row;
            }
            echo json_encode(['success' => true, 'messages' => $messages]);
        } else {
            echo json_encode(['error' => 'Error fetching messages: ' . $conn->error]);
        }
        break;

    case 'POST':
        // View message details
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];

        $sql = "SELECT * FROM messages WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $row = $result->fetch_assoc()) {
            echo json_encode(['success' => true, 'message' => $row]);
        } else {
            echo json_encode(['error' => 'Message not found']);
        }
        break;

    case 'DELETE':
        // Delete a message
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];

        $sql = "DELETE FROM messages WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Error deleting message: ' . $stmt->error]);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid request method']);
        break;
}

$conn->close();
?>