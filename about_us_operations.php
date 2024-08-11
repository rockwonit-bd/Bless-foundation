<?php
header('Content-Type: application/json');
// Database connection
require 'db_conn.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

function getAboutUsContent($conn) {
    $sql = "SELECT content_en, content_bn FROM about_us LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        return $result->fetch_assoc();
    }
    return ['content_en' => '', 'content_bn' => ''];
}

function updateAboutUsContent($conn, $contentEn, $contentBn) {
    $sql = "UPDATE about_us SET content_en = ?, content_bn = ? WHERE id = 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $contentEn, $contentBn);
    $result = $stmt->execute();

    if (!$result) {
        error_log("MySQL Error: " . $stmt->error);
        return false;
    }

    if ($stmt->affected_rows === 0) {
        // If no rows were updated, try inserting a new row
        $sql = "INSERT INTO about_us (id, content_en, content_bn) VALUES (1, ?, ?) ON DUPLICATE KEY UPDATE content_en = VALUES(content_en), content_bn = VALUES(content_bn)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $contentEn, $contentBn);
        $result = $stmt->execute();

        if (!$result) {
            error_log("MySQL Error: " . $stmt->error);
            return false;
        }
    }

    return true;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = getAboutUsContent($conn);
    echo json_encode(['success' => true, 'data' => $content]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $contentEn = $data['content_en'] ?? '';
    $contentBn = $data['content_bn'] ?? '';

    error_log("Received data - content_en: " . substr($contentEn, 0, 100) . "..., content_bn: " . substr($contentBn, 0, 100) . "...");

    $result = updateAboutUsContent($conn, $contentEn, $contentBn);
    echo json_encode(['success' => $result]);
}

$conn->close();
?>