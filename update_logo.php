<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $position = $_POST['position'];

    // Check if file was uploaded without errors
    if(isset($_FILES["logo_image"]) && $_FILES["logo_image"]["error"] == 0){
        $allowed = array("jpg" => "image/jpg", "jpeg" => "image/jpeg", "gif" => "image/gif", "png" => "image/png");
        $filename = $_FILES["logo_image"]["name"];
        $filetype = $_FILES["logo_image"]["type"];
        $filesize = $_FILES["logo_image"]["size"];

        // Verify file extension
        $ext = pathinfo($filename, PATHINFO_EXTENSION);
        if(!array_key_exists($ext, $allowed)) die("Error: Please select a valid file format.");

        // Verify file size - 5MB maximum
        $maxsize = 5 * 1024 * 1024;
        if($filesize > $maxsize) die("Error: File size is larger than the allowed limit.");

        // Verify MIME type of the file
        if(in_array($filetype, $allowed)){
            // Generate a unique filename to avoid overwriting
            $new_filename = uniqid() . "." . $ext;
            $upload_path = "uploads/logos/" . $new_filename;

            if(move_uploaded_file($_FILES["logo_image"]["tmp_name"], $upload_path)){
                // Check if a logo already exists for this position
                $check_sql = "SELECT image_path FROM logos WHERE position = ?";
                $check_stmt = $conn->prepare($check_sql);
                $check_stmt->bind_param("s", $position);
                $check_stmt->execute();
                $result = $check_stmt->get_result();

                if($result->num_rows > 0) {
                    // Delete the old logo file
                    $old_logo = $result->fetch_assoc()['image_path'];
                    if(file_exists($old_logo)) {
                        unlink($old_logo);
                    }

                    // Update existing logo
                    $sql = "UPDATE logos SET image_path = ? WHERE position = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ss", $upload_path, $position);
                } else {
                    // Insert new logo
                    $sql = "INSERT INTO logos (position, image_path) VALUES (?, ?)";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ss", $position, $upload_path);
                }

                if($stmt->execute()){
                    echo "Logo uploaded and saved successfully.";
                } else{
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
                $stmt->close();
            } else{
                echo "Error: There was an error uploading your file.";
            }
        } else{
            echo "Error: There was a problem uploading your file. Please try again.";
        }
    } else{
        echo "Error: " . $_FILES["logo_image"]["error"];
    }
}

$conn->close();
?>