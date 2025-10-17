<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight requests (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "u484104073_Mateo_Baute", "q:!TuP&lrP2", "u484104073_EgresApp_BBDD");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos: " . $mysqli->connect_error]);
    exit();
}

// Verifica que se use POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido. Se esperaba POST."]);
    exit();
}

// Obtener datos del cuerpo de la solicitud (JSON)
$json = file_get_contents('php://input');
$input = json_decode($json, true);

// Validar que se recibieron datos JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Datos JSON inválidos: " . json_last_error_msg()]);
    exit();
}

// Ahora sí: leer los valores que vienen del fetch
$email = $input['email'] ?? '';
$contraseña = $input['contraseña'] ?? '';

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "El formato del email no es válido"]);
    exit();
}

// Preparar consulta para verificar credenciales
$sql = "SELECT id_empresa, Nombre_empresa, Mail, Teléfono, Dirección, Enfoque 
        FROM empresa 
        WHERE Mail = ? AND Contraseña = ?";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta: " . $mysqli->error]);
    exit();
}

// Vincular parámetros
$stmt->bind_param("ss", $email, $contraseña);

// Ejecutar la consulta
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta: " . $stmt->error]);
    exit();
}

// Obtener resultado
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Credenciales inválidas"]);
    exit();
}

// Login exitoso
$empresa = $result->fetch_assoc();

// Iniciar sesión (opcional)
session_start();
$_SESSION['empresa_id'] = $empresa['id_empresa'];
$_SESSION['empresa_nombre'] = $empresa['Nombre_empresa'];
$_SESSION['empresa_email'] = $empresa['Mail'];

http_response_code(200);
echo json_encode([
    "success" => true, 
    "message" => "Login exitoso",
    "empresa" => [
        "id" => $empresa['id_empresa'],
        "nombre" => $empresa['Nombre_empresa'],
        "email" => $empresa['Mail'],
        "telefono" => $empresa['Teléfono'],
        "direccion" => $empresa['Dirección'],
        "enfoque" => $empresa['Enfoque']
    ]
]);

$stmt->close();
$mysqli->close();
?>