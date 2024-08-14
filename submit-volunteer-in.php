<?php
// Disable error reporting to prevent any HTML output
error_reporting(0);
ini_set('display_errors', 0);

// Ensure we're only outputting JSON
header('Content-Type: application/json');

$response = array('success' => false, 'message' => '');

try {
    // Database connection
    require 'db_conn.php';

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Verify hCaptcha
    $secret = 'ES_ca7602515451434fb7b1da278eb5bf1e';
    $verifyResponse = file_get_contents('https://hcaptcha.com/siteverify?secret='.$secret.'&response='.$_POST['h-captcha-response']);
    $responseData = json_decode($verifyResponse);

    if (!$responseData->success) {
        throw new Exception("hCaptcha verification failed. Please try again.");
    }

    // Process form data
    $firstName = $conn->real_escape_string($_POST['first_name']);
    $lastName = $conn->real_escape_string($_POST['last_name']);
    $email = $conn->real_escape_string($_POST['email']);
    $phone = $conn->real_escape_string($_POST['phone']);
    $gender = $conn->real_escape_string($_POST['gender']);
    $country = $conn->real_escape_string($_POST['country']);
    $biography = $conn->real_escape_string($_POST['biography']);
    $contribution = $conn->real_escape_string($_POST['contribution']);
    $hobbies = $conn->real_escape_string($_POST['hobbies']);

    // File upload function with unique name generation
    function uploadFile($file, $uploadDir) {
        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            throw new Exception("No file uploaded or upload failed.");
        }

        $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

        // Check file size (2MB limit)
        if ($file["size"] > 2000000) {
            throw new Exception("File is too large. Maximum size is 2MB.");
        }

        // Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
            throw new Exception("Only JPG, JPEG, PNG files are allowed.");
        }

        // Generate a unique filename
        $uniqueName = uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $imageFileType;
        $targetFile = $uploadDir . $uniqueName;

        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            return $targetFile;
        } else {
            throw new Exception("Error uploading file.");
        }
    }

    // Upload files
    $uploadDir = "uploads/volunteer_in/";
    $picturePath = uploadFile($_FILES["picture"], $uploadDir);
    $identityPath = uploadFile($_FILES["identity"], $uploadDir);

    // Insert data into database
    $sql = "INSERT INTO volunteer_in (first_name, last_name, email, phone, gender, country, identity, picture, biography, contribution, hobbies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssss", $firstName, $lastName, $email, $phone, $gender, $country, $identityPath, $picturePath, $biography, $contribution, $hobbies);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = "Form submitted successfully.";
    } else {
        throw new Exception("Error: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
exit;
?>