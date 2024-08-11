<?php
// Ensure all errors are caught and returned as JSON
function exception_handler($exception) {
    echo json_encode(['error' => $exception->getMessage()]);
}
set_exception_handler('exception_handler');

// Ensure all PHP errors are caught and returned as JSON
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

// Output as JSON
header('Content-Type: application/json');

// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    throw new Exception("Connection failed: " . $conn->connect_error);
}

// Function to extract YouTube video ID from URL or iframe
function extractYoutubeId($input) {
    if (preg_match('/youtube\.com\/embed\/([^"]+)/', $input, $match)) {
        return $match[1];
    } elseif (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $input, $match)) {
        return $match[1];
    }
    return false;
}

// Handle POST request (Add or Update video)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $youtube_url = $_POST['youtube_url'];
    $title = $_POST['title'];
    $description = $_POST['description'];

    $video_id = extractYoutubeId($youtube_url);
    if (!$video_id) {
        throw new Exception('Invalid YouTube URL or embed code');
    }

    $youtube_url = "https://www.youtube.com/embed/" . $video_id;

    if ($id) {
        // Update existing video
        $stmt = $conn->prepare("UPDATE videos SET youtube_url = ?, title = ?, description = ? WHERE id = ?");
        $stmt->bind_param("sssi", $youtube_url, $title, $description, $id);
    } else {
        // Add new video
        $stmt = $conn->prepare("INSERT INTO videos (youtube_url, title, description) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $youtube_url, $title, $description);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => $id ? 'Video updated successfully' : 'Video added successfully']);
    } else {
        throw new Exception('Error: ' . $stmt->error);
    }
    $stmt->close();
}

// Handle GET request (Fetch videos)
elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM videos ORDER BY created_at DESC");
    $videos = [];
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
    echo json_encode(['success' => true, 'videos' => $videos]);
}

// Handle DELETE request
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        throw new Exception('Missing video ID');
    }
    $id = intval($data['id']);

    $stmt = $conn->prepare("DELETE FROM videos WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Video deleted successfully']);
    } else {
        throw new Exception('Error: ' . $stmt->error);
    }
    $stmt->close();
}

$conn->close();
?>