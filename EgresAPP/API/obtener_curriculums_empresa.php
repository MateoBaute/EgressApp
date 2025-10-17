 
<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener el ID de la empresa desde el query parameter
$id_empresa = $_GET['id_empresa'] ?? '';

if (empty($id_empresa) || !is_numeric($id_empresa)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "ID de empresa válido requerido"]);
    exit();
}

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "u484104073_Mateo_Baute", "q:!TuP&lrP2", "u484104073_EgresApp_BBDD");

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
    exit();
}

// CONSULTA SQL - Obtener currículums de las postulaciones de la empresa
$sql = "SELECT llamado.Nombre_Oferta, postulaciones.curriculum_link FROM llamado INNER JOIN postulaciones ON llamado.id_llamado = postulaciones.Id_llamado WHERE llamado.id_empresa = ?";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al preparar la consulta"]);
    exit();
}

$stmt->bind_param("i", $id_empresa);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al ejecutar la consulta"]);
    exit();
}

$result = $stmt->get_result();
$curriculums = [];

while ($fila = $result->fetch_assoc()) {
    $curriculums[] = [
        'curriculum_link' => $fila['curriculum_link'],
        'Nombre_Oferta' => $fila['Nombre_Oferta']
    ];
}

$stmt->close();
$mysqli->close();

echo json_encode([
    "success" => true,
    "curriculums" => $curriculums,
    "total" => count($curriculums)
]);
?>