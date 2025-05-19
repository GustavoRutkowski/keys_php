<?php

namespace Source\Utils;

use PDO;
use PDOException;
use InvalidArgumentException;

const CONF_DB_HOST = "localhost"; // localhost
const CONF_DB_NAME = "keys_php";
const CONF_DB_USER = "root";
const CONF_DB_PASS = "asdf1234"; // nada

abstract class Connect
{
    private const OPTIONS = [
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
        PDO::ATTR_CASE => PDO::CASE_NATURAL
    ];

    private static $instance;

    public static function getInstance(): ?PDO
    {
        if (empty(self::$instance)) {
            try {
                self::$instance = new PDO(
                    "mysql:host=" . CONF_DB_HOST . ";dbname=" . CONF_DB_NAME,
                    CONF_DB_USER,
                    CONF_DB_PASS,
                    self::OPTIONS
                );
            } catch (PDOException $exception) {
                //redirect("/ops/problemas");
                echo "Problemas ao Conectar! ";
                echo $exception->getMessage();
            }
        }

        return self::$instance;
    }

    public static function execute(string $query, array $data = [])
    {
        $queryType = strtoupper(strtok(trim($query), ' '));
        $allowedTypes = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
 
        if (!in_array($queryType, $allowedTypes)) {
            throw new InvalidArgumentException(
                "Tipo de query não suportado: $queryType"
            );
        }

        try {
            $stmt = self::getInstance()->prepare($query);
            $stmt->execute($data);

            switch ($queryType) {
                case 'INSERT':
                    return [
                        'action' => 'INSERT',
                        'insertId' => self::getInstance()->lastInsertId()
                    ];

                case 'SELECT':
                    return [
                        'action' => 'SELECT',
                        'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
                    ];

                case 'UPDATE':
                    return [
                        'action' => 'UPDATE'
                    ];

                case 'DELETE':
                    return [
                        'action' => 'DELETE',
                        'affectedRows' => $stmt->rowCount()
                    ];
            }
        } catch (PDOException $e) {
            return [
                'action' => 'ERROR',
                'message' => $e->getMessage()
            ];
        }
    }

    // Outros...

    final private function __construct()
    {
    }

    private function __clone()
    {
    }
}