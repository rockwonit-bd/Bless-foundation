<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => false, 'message' => 'Unauthorized access']));
}
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'add':
        addImage($conn);
        break;
    case 'get':
        getImages($conn);
        break;
    case 'delete':
        deleteImage($conn);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function addImage($conn) {
    if (isset($_FILES['image'])) {
        $target_dir = "uploads/slider/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        $target_file = $target_dir . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Check if image file is an actual image or fake image
        $check = getimagesize($_FILES["image"]["tmp_name"]);
        if($check === false) {
            die(json_encode(['success' => false, 'message' => 'File is not an image.']));
        }

        // Check file size (limit to 5MB)
        if ($_FILES["image"]["size"] > 5000000) {
            die(json_encode(['success' => false, 'message' => 'Sorry, your file is too large.']));
        }

        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
            die(json_encode(['success' => false, 'message' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']));
        }

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            $image_path = "uploads/slider/" . basename($_FILES["image"]["name"]);
            $caption = $conn->real_escape_string($_POST['caption']);

            $sql = "INSERT INTO image_slider (image_path, caption) VALUES ('$image_path', '$caption')";
            if ($conn->query($sql) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'Image uploaded successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Sorry, there was an error uploading your file.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No image file received']);
    }
}

function getImages($conn) {
    $sql = "SELECT * FROM image_slider ORDER BY id DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $images = [];
        while($row = $result->fetch_assoc()) {
            $images[] = $row;
        }
        echo json_encode(['success' => true, 'images' => $images]);
    } else {
        echo json_encode(['success' => true, 'images' => []]);
    }
}

function deleteImage($conn) {
    $id = $conn->real_escape_string($_POST['id']);

    // First, get the image path
    $sql = "SELECT image_path FROM image_slider WHERE id = $id";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $image_path = "" . $row['image_path'];

        // Delete the file
        if (file_exists($image_path)) {
            unlink($image_path);
        }

        // Now delete the database entry
        $sql = "DELETE FROM image_slider WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Image deleted successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error deleting image: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Image not found']);
    }
}

$conn->close();
?>