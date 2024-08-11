<?php
// Error reporting
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

try {
    // Database connection
    require 'db_conn.php';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    function handleFileUpload($file) {
        $target_dir = "uploads/tales/";
        $target_file = $target_dir . basename($file["name"]);
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

        // Check if image file is a actual image or fake image
        $check = getimagesize($file["tmp_name"]);
        if($check === false) {
            return ["error" => "File is not an image."];
        }

        // Check file size
        if ($file["size"] > 500000) {
            return ["error" => "Sorry, your file is too large."];
        }

        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
            && $imageFileType != "gif" ) {
            return ["error" => "Sorry, only JPG, JPEG, PNG & GIF files are allowed."];
        }

        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            return ["success" => true, "file_path" => $target_file];
        } else {
            return ["error" => "Sorry, there was an error uploading your file."];
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        if (isset($_GET['id'])) {
            // Fetch a single tale
            $id = $conn->real_escape_string($_GET['id']);
            $sql = "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as formatted_created_at FROM motivating_tales WHERE id = $id";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                echo json_encode($result->fetch_assoc());
            } else {
                echo json_encode(['error' => 'Tale not found']);
            }
        } else {
            // Fetch all tales
            $sql = "SELECT *, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as formatted_created_at FROM motivating_tales ORDER BY created_at DESC";
            $result = $conn->query($sql);

            $tales = [];
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $tales[] = $row;
                }
            }
            echo json_encode($tales);
        }
    }


    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode($_POST['data'], true);

        // Fetch the current image path before updating
        $current_image_path = '';
        if (isset($data['id'])) {
            $id = $conn->real_escape_string($data['id']);
            $sql = "SELECT image_path FROM motivating_tales WHERE id = $id";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $current_image_path = $row['image_path'];
            }
        }

        if (isset($_FILES['image']) && $_FILES['image']['size'] > 0) {
            $upload_result = handleFileUpload($_FILES['image']);
            if (isset($upload_result['error'])) {
                throw new Exception($upload_result['error']);
            }
            $image_path = $upload_result['file_path'];

            // Delete the old image file if it exists and is different from the new one
            if (!empty($current_image_path) && $current_image_path !== $image_path && file_exists($current_image_path)) {
                unlink($current_image_path);
            }
        } else {
            // If no new image is uploaded, use the existing image path
            $image_path = $data['image_path'];
        }

        $description_en = $conn->real_escape_string($data['description_en']);
        $description_bn = $conn->real_escape_string($data['description_bn']);

        if (isset($data['id'])) {
            // Update existing tale
            $id = $conn->real_escape_string($data['id']);
            $sql = "UPDATE motivating_tales SET image_path='$image_path', description_en='$description_en', description_bn='$description_bn' WHERE id=$id";
        } else {
            // Add new tale
            $sql = "INSERT INTO motivating_tales (image_path, description_en, description_bn) VALUES ('$image_path', '$description_en', '$description_bn')";
        }

        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'message' => 'Tale saved successfully']);
        } else {
            throw new Exception('Error: ' . $conn->error);
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $conn->real_escape_string($data['id']);

        // First, get the image path
        $sql = "SELECT image_path FROM motivating_tales WHERE id=$id";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $image_path = $row['image_path'];

            // Delete the database entry
            $sql = "DELETE FROM motivating_tales WHERE id=$id";
            if ($conn->query($sql) === TRUE) {
                // If database deletion is successful, delete the image file
                if (file_exists($image_path)) {
                    if (unlink($image_path)) {
                        echo json_encode(['success' => true, 'message' => 'Tale and image deleted successfully']);
                    } else {
                        echo json_encode(['success' => true, 'message' => 'Tale deleted successfully, but failed to delete image file']);
                    }
                } else {
                    echo json_encode(['success' => true, 'message' => 'Tale deleted successfully, image file not found']);
                }
            } else {
                throw new Exception('Error deleting tale: ' . $conn->error);
            }
        } else {
            throw new Exception('Tale not found');
        }
    }

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn->close();
?>