<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Load the HTML content
$html_content = file_get_contents('adminpanel.html');

// Replace the username placeholder with the actual username
$html_content = str_replace('<?php echo htmlspecialchars($_SESSION[\'username\']); ?>', htmlspecialchars($_SESSION['username']), $html_content);

// Output the modified HTML content
echo $html_content;
?>