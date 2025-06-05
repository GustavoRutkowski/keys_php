<?php

ob_start();

require  __DIR__ . "../vendor/autoload.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true'); // Permitir credenciais

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use CoffeeCode\Router\Router;

const API_HOST = 'https://localhost:8080';

$route = new Router(API_HOST . '/', ':');

// Define o namespace do diretório dos controllers
$route->namespace("Source\Controllers");

/* USERS */

$route->group("/users");
    $route->post('/', 'UsersController:createUser');

    $route->get('/id/{id}', 'UsersController:getUserByID');
    $route->get('/user', 'UsersController:getUser');

    $route->put('/user', 'UsersController:updateUser');

    $route->post('/login', 'UsersController:login');
$route->group("null");

$route->group("/passwords");
    $route->post("/", "PasswordsController:createPassword");
    
    $route->get("/all", "PasswordsController:getAllPasswords"); 
    $route->get("/id/{id}", "PasswordsController:getPasswordById");

    $route->put("/id/{id}", "PasswordsController:updatePassword"); 

    $route->delete("/id/{id}", "PasswordsController:deletePassword");
$route->group("null");

$route->group("/softwares");
    $route->get("/all", "SoftwaresController:getAllSoftwares");
    $route->get("/id/{id}", "SoftwaresController:getSoftwareById");
    $route->get("/pass-id/{passID}", "SoftwaresController:getSoftwareByPasswordId");

    $route->post("/", "SoftwaresController:createSoftware");
    $route->put("/id/{id}", "SoftwaresController:updateSoftware");
    $route->delete("/id/{id}", "SoftwaresController:deleteSoftware");
$route->group("null");


$route->dispatch();

// Qualquer erro levará para esse caminho:
if ($route->error()) {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(404);

    echo json_encode([
        "status" => 404,
        "message" => "URL não encontrada"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

ob_end_flush();