<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    require 'db_conn.php';

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $login = $_POST['login'];
    $password = $_POST['password'];

    $sql = "SELECT id, username, email, password FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $login, $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['email'] = $row['email'];
            header("Location: adminpanel.php");
            exit();
        } else {
            $error = "Invalid login credentials";
        }
    } else {
        $error = "Invalid login credentials";
    }

    $stmt->close();
    $conn->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Bless Foundation</title>
    <link rel="stylesheet" href="css/login.css">
</head>
<body>
<div class="login-container fade-in">
    <h1>Login</h1>
    <?php if (isset($error)) { ?>
        <p style="color: red;"><?php echo $error; ?></p>
    <?php } ?>
    <form method="POST" action="">
        <input type="text" name="login" placeholder="Username or Email" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log In</button>
    </form>
    <a href="#" id="forgotPassword" class="forgot-password">Forgot Password?</a>
</div>

<div id="myModal" class="modal">
    <div class="modal-content fade-in">
        <span class="close">&times;</span>
        <p>Please contact your system administrator.</p>
    </div>
</div>

<script src="login.js"></script>
</body>
</html>