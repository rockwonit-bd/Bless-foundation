<?php
header('Content-Type: application/json');

require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Function to sanitize input
function sanitize($input) {
    return htmlspecialchars(strip_tags($input));
}

// Function to delete file
function deleteFile($file_path) {
    if (file_exists($file_path)) {
        unlink($file_path);
    }
}

// Read all projects
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM projects ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $projects = [];
        while($row = $result->fetch_assoc()) {
            $projects[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $projects]);
    } else {
        echo json_encode(['success' => true, 'data' => []]);
    }
}

// Create or Update a project
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $title_en = sanitize($_POST['titleEn']);
    $title_bn = sanitize($_POST['titleBn']);
    $short_desc_en = $_POST['shortDescEn'];
    $short_desc_bn = $_POST['shortDescBn'];
    $detailed_desc_en = $_POST['detailedDescEn'];
    $detailed_desc_bn = $_POST['detailedDescBn'];

    // Handle image upload
    $image_path = '';
    $old_image_path = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $upload_dir = 'uploads/projects/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        $file_name = time() . '_' . $_FILES['image']['name'];
        $file_path = $upload_dir . $file_name;
        if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
            $image_path = 'uploads/projects/' . $file_name;

            // If updating, get the old image path
            if ($id) {
                $sql = "SELECT image_path FROM projects WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("i", $id);
                $stmt->execute();
                $result = $stmt->get_result();
                if ($row = $result->fetch_assoc()) {
                    $old_image_path = $row['image_path'];
                }
            }
        } else {
            echo json_encode(['error' => 'Failed to upload image']);
            exit;
        }
    } elseif (isset($_POST['existingImage'])) {
        $image_path = $_POST['existingImage'];
    }

    if ($id) {
        // Update existing project
        $sql = "UPDATE projects SET 
                title_en = ?, title_bn = ?, short_desc_en = ?, short_desc_bn = ?,
                detailed_desc_en = ?, detailed_desc_bn = ?" .
            ($image_path ? ", image_path = ?" : "") .
            " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if ($image_path) {
            $stmt->bind_param("sssssssi", $title_en, $title_bn, $short_desc_en, $short_desc_bn,
                $detailed_desc_en, $detailed_desc_bn, $image_path, $id);
        } else {
            $stmt->bind_param("ssssssi", $title_en, $title_bn, $short_desc_en, $short_desc_bn,
                $detailed_desc_en, $detailed_desc_bn, $id);
        }
    } else {
        // Create new project
        $sql = "INSERT INTO projects (title_en, title_bn, short_desc_en, short_desc_bn,
                detailed_desc_en, detailed_desc_bn, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssss", $title_en, $title_bn, $short_desc_en, $short_desc_bn,
            $detailed_desc_en, $detailed_desc_bn, $image_path);
    }

    if ($stmt->execute()) {
        // If updating and a new image was uploaded, delete the old image
        if ($id && $old_image_path && $old_image_path !== $image_path) {
            deleteFile($old_image_path);
        }
        echo json_encode(['success' => true, 'message' => $id ? 'Project updated successfully' : 'Project created successfully']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

// Delete a project
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id']);

    // First, get the image path
    $sql = "SELECT image_path FROM projects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $project = $result->fetch_assoc();

    // Delete the project from the database
    $sql = "DELETE FROM projects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // If deletion from database was successful, delete the image file
        if ($project && $project['image_path']) {
            deleteFile($project['image_path']);
        }
        echo json_encode(['success' => true, 'message' => 'Project deleted successfully']);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
}

$conn->close();
?>