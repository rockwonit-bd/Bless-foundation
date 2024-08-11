<?php
header('Content-Type: application/json'); // Change to JSON for easier parsing in JavaScript

// Database connection details
require 'db_conn.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to get current social links
function getCurrentSocialLinks($conn) {
    $links = [];
    $sql = "SELECT platform, url FROM social_links";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $links[$row["platform"]] = $row["url"];
        }
    }

    return $links;
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $platforms = ['facebook', 'youtube', 'instagram'];
    $updated = false;
    $messages = [];

    foreach ($platforms as $platform) {
        if (isset($_POST[$platform]) && !empty($_POST[$platform])) {
            $url = sanitize_input($_POST[$platform]);

            // Check if the platform already exists in the database
            $stmt = $conn->prepare("SELECT * FROM social_links WHERE platform = ?");
            $stmt->bind_param("s", $platform);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                // Update existing record
                $stmt = $conn->prepare("UPDATE social_links SET url = ? WHERE platform = ?");
                $stmt->bind_param("ss", $url, $platform);
            } else {
                // Insert new record
                $stmt = $conn->prepare("INSERT INTO social_links (platform, url) VALUES (?, ?)");
                $stmt->bind_param("ss", $platform, $url);
            }

            if ($stmt->execute()) {
                $updated = true;
                $messages[] = ucfirst($platform) . " link updated successfully.";
            } else {
                $messages[] = "Error updating " . ucfirst($platform) . " link: " . $conn->error;
            }
            $stmt->close();
        }
    }

    if ($updated) {
        echo json_encode(["success" => true, "messages" => $messages]);
    } else {
        echo json_encode(["success" => false, "message" => "No changes were made."]);
    }
} else {
    // If it's not a POST request, return the current social links
    $currentLinks = getCurrentSocialLinks($conn);
    echo json_encode(["success" => true, "data" => $currentLinks]);
}

$conn->close();
?>