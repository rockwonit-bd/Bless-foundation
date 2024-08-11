<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'getUsers':
        getUsers($conn);
        break;
    case 'addUser':
        addUser($conn);
        break;
    case 'updateUser':
        updateUser($conn);
        break;
    case 'deleteUser':
        deleteUser($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function getUsers($conn) {
    $sql = "SELECT id, username, email FROM users";
    $result = $conn->query($sql);
    $users = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    echo json_encode(['success' => true, 'users' => $users]);
}

function addUser($conn) {
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password')";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'User added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function updateUser($conn) {
    $id = $conn->real_escape_string($_POST['id']);
    $username = $conn->real_escape_string($_POST['username']);
    $email = $conn->real_escape_string($_POST['email']);
    $password = $_POST['password'] ?? null;

    $sql = "UPDATE users SET username='$username', email='$email'";
    if ($password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $sql .= ", password='$hashedPassword'";
    }
    $sql .= " WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function deleteUser($conn) {
    $id = $conn->real_escape_string($_POST['id']);

    // Prevent deletion of the first user (admin)
    if ($id == '1') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete the main admin user']);
        return;
    }

    $sql = "DELETE FROM users WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

$conn->close();
?>