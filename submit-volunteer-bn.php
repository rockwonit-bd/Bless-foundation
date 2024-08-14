<?php
header('Content-Type: application/json');

$response = array('success' => false, 'message' => '');

// Wrap everything in a try-catch block
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
    $religion = $conn->real_escape_string($_POST['religion']);
    $area = $conn->real_escape_string($_POST['area']);

    // File upload function
    function uploadFile($file, $uploadDir) {
        $imageFileType = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

        // Generate a unique filename
        $uniqueName = uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $imageFileType;
        $targetFile = $uploadDir . $uniqueName;

        // Check file size (2MB limit)
        if ($file["size"] > 2000000) {
            throw new Exception("File is too large. Maximum size is 2MB.");
        }

        // Allow certain file formats
        if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
            throw new Exception("Only JPG, JPEG, PNG files are allowed.");
        }

        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            return $targetFile;
        } else {
            throw new Exception("Error uploading file.");
        }
    }

    // Upload files
    $uploadDir = "uploads/volunteer_bn/";
    $picturePath = uploadFile($_FILES["picture"], $uploadDir);
    $identityPath = uploadFile($_FILES["identity"], $uploadDir);

    // Insert data into database
    $sql = "INSERT INTO volunteer_bn (first_name, last_name, email, phone, gender, religion, area, image_path_bn, identity_path_bn)
            VALUES ('$firstName', '$lastName', '$email', '$phone', '$gender', '$religion', '$area', '$picturePath', '$identityPath')";

    if ($conn->query($sql) === TRUE) {
        $response['success'] = true;
        $response['message'] = "Form submitted successfully.";
    } else {
        throw new Exception("Error: " . $sql . "<br>" . $conn->error);
    }

    $conn->close();

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>