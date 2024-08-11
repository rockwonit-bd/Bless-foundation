<?php
// Prevent any output before intended JSON response
ob_start();

// Error handling to catch any PHP errors and prevent them from being output
function exception_error_handler($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
}
set_error_handler("exception_error_handler");

// Database connection details
require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Function to handle file upload
function uploadPhoto($conn) {
    $target_dir = "uploads/photos/";
    $target_file = $target_dir . basename($_FILES["photo"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image
    $check = getimagesize($_FILES["photo"]["tmp_name"]);
    if($check === false) {
        return ["error" => "File is not an image."];
    }

    // Check file size
    if ($_FILES["photo"]["size"] > 500000) {
        return ["error" => "Sorry, your file is too large."];
    }

    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
        && $imageFileType != "gif" ) {
        return ["error" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."];
    }

    // Generate a unique filename
    $new_filename = uniqid() . '.' . $imageFileType;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
        $caption = $_POST['caption'];
        $sql = "INSERT INTO photos (file_path, caption) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $target_file, $caption);

        if ($stmt->execute()) {
            return ["success" => "The file ". basename( $_FILES["photo"]["name"]). " has been uploaded."];
        } else {
            return ["error" => "Sorry, there was an error uploading your file."];
        }
    } else {
        return ["error" => "Sorry, there was an error uploading your file."];
    }
}

// Function to fetch all photos
function getPhotos($conn) {
    $sql = "SELECT id, file_path, caption FROM photos ORDER BY upload_date DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $photos = [];
        while($row = $result->fetch_assoc()) {
            $photos[] = $row;
        }
        return ["success" => true, "photos" => $photos];
    } else {
        return ["success" => true, "photos" => []];
    }
}

// Function to delete a photo
function deletePhoto($conn, $id) {
    // First, get the file path
    $sql = "SELECT file_path FROM photos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $file_path = $row['file_path'];

        // Delete the record from the database
        $sql = "DELETE FROM photos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            // If successfully deleted from the database, delete the file
            if (file_exists($file_path)) {
                unlink($file_path);
            }
            return ["success" => "Photo deleted successfully"];
        } else {
            return ["error" => "Error deleting photo"];
        }
    } else {
        return ["error" => "Photo not found"];
    }
}

// Handle different operations based on the request method and parameters
try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $result = uploadPhoto($conn);
    } elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
        $result = getPhotos($conn);
    } elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data['id'])) {
            $result = deletePhoto($conn, $data['id']);
        } else {
            throw new Exception("No photo ID provided");
        }
    } else {
        throw new Exception("Invalid request method");
    }

    // Clear any output buffers
    ob_clean();

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the JSON result
    echo json_encode($result);

} catch (Exception $e) {
    // Clear any output buffers
    ob_clean();

    // Set the content type to JSON
    header('Content-Type: application/json');

    // Output the error as JSON
    echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>