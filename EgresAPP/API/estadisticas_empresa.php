<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$id_empresa = $input['id_empresa'] ?? '';

if (empty($id_empresa)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Falta el ID de empresa"]);
    exit();
}

$mysqli = new mysqli("localhost", "u484104073_Mateo_Baute", "q:!TuP&lrP2", "u484104073_EgresApp_BBDD");
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión"]);
    exit();
}

// Total de ofertas publicadas
$queryOfertas = $mysqli->prepare("SELECT COUNT(*) AS total FROM llamado WHERE id_empresa = ?");
$queryOfertas->bind_param("i", $id_empresa);
$queryOfertas->execute();
$resultOfertas = $queryOfertas->get_result()->fetch_assoc();
$totalOfertas = $resultOfertas['total'] ?? 0;

// Total de postulaciones
$queryPostulaciones = $mysqli->prepare("
    SELECT COUNT(*) AS total
    FROM postulaciones p
    INNER JOIN llamado l ON p.id_llamado = l.id_llamado
    WHERE l.id_empresa = ?
");
$queryPostulaciones->bind_param("i", $id_empresa);
$queryPostulaciones->execute();
$resultPostulaciones = $queryPostulaciones->get_result()->fetch_assoc();
$totalPostulaciones = $resultPostulaciones['total'] ?? 0;

// Oferta más popular
$queryPopular = $mysqli->prepare("
    SELECT l.Nombre_Oferta, COUNT(p.id_postulacion) AS total
    FROM postulaciones p
    INNER JOIN llamado l ON p.id_llamado = l.id_llamado
    WHERE l.id_empresa = ?
    GROUP BY l.id_llamado
    ORDER BY total DESC
    LIMIT 1
");
$queryPopular->bind_param("i", $id_empresa);
$queryPopular->execute();
$resultPopular = $queryPopular->get_result()->fetch_assoc();

$ofertaPopular = $resultPopular['Nombre_Oferta'] ?? "Sin postulaciones";
$postulacionesPopular = $resultPopular['total'] ?? 0;

echo json_encode([
    "success" => true,
    "total_ofertas" => (int)$totalOfertas,
    "total_postulaciones" => (int)$totalPostulaciones,
    "oferta_popular" => $ofertaPopular,
    "postulaciones_popular" => (int)$postulacionesPopular
]);

$mysqli->close();
?>
