<?php
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

// Function to extract or validate URL
function processMapUrl($input) {
    // Check if it's a full embed code
    if (strpos($input, '<iframe') !== false) {
        preg_match('/src="([^"]+)"/', $input, $matches);
        return isset($matches[1]) ? $matches[1] : '';
    }
    // Check if it's a valid URL
    elseif (filter_var($input, FILTER_VALIDATE_URL)) {
        return $input;
    }
    // If neither, return empty string
    return '';
}

// Handle POST request (update content)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $officeAddressEn = $_POST['officeAddressEn'];
    $officeAddressBn = $_POST['officeAddressBn'];
    $googleMapEmbed = processMapUrl($_POST['googleMapEmbed']);
    $ngoMemberInfoEn = $_POST['ngoMemberInfoEn'];
    $ngoMemberInfoBn = $_POST['ngoMemberInfoBn'];

    // Check if a row exists
    $checkSql = "SELECT COUNT(*) as count FROM contact_us_content";
    $result = $conn->query($checkSql);
    $row = $result->fetch_assoc();
    $rowExists = $row['count'] > 0;

    if ($rowExists) {
        // Update existing row
        $sql = "UPDATE contact_us_content SET 
                office_address_en = ?, 
                office_address_bn = ?, 
                google_map_embed_link = ?, 
                ngo_member_info_en = ?, 
                ngo_member_info_bn = ?";
    } else {
        // Insert new row
        $sql = "INSERT INTO contact_us_content 
                (office_address_en, office_address_bn, google_map_embed_link, ngo_member_info_en, ngo_member_info_bn) 
                VALUES (?, ?, ?, ?, ?)";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $officeAddressEn, $officeAddressBn, $googleMapEmbed, $ngoMemberInfoEn, $ngoMemberInfoBn);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Contact information updated successfully']);
    } else {
        echo json_encode(['error' => 'Error updating contact information: ' . $stmt->error]);
    }

    $stmt->close();
}

// Handle GET request (fetch content)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM contact_us_content LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $row]);
    } else {
        echo json_encode(['success' => true, 'data' => null]);
    }
}

$conn->close();
?>