<?php

namespace Source\Models;

use Source\Utils\Connect;

class Software
{
    public $TABLE = 'softwares';

    private $id;
    private $name;
    private $icon;

    public function __construct(?int $id, ?string $name = null, ?string $icon = null)
    {
        $this->id = $id;
        $this->name = $name;
        $this->icon = $icon;
    }

    // Criar software
    public static function create(string $name, ?string $icon = null)
    {
        if (!$name) {
            return ['success' => false, 'message' => 'name is required'];
        }

        $query = "INSERT INTO softwares (name, icon) VALUES (?, ?)";
        $result = Connect::execute($query, [$name, $icon]);

        if (isset($result['insertId'])) {
            return ['success' => true, 'insertId' => $result['insertId']];
        }

        return ['success' => false, 'message' => 'failed to create software'];
    }

    // Listar todos os softwares
    public static function getAll()
    {
        $query = "SELECT id, name, icon FROM softwares";
        $results = Connect::execute($query)['data'];

        return $results;
    }

    // Buscar software por ID
    public static function getById(int $id)
    {
        $query = "SELECT id, name, icon FROM softwares WHERE id = ?";
        $results = Connect::execute($query, [$id])['data'];

        if (count($results) === 0) {
            return ['success' => false, 'message' => 'software not found'];
        }

        return $results[0];
    }
    // Buscar software pelo ID da senha
    public static function getByPasswordId(int $passwordId)
    {
        $query = "SELECT s.id, s.name, s.icon
            FROM softwares s
            JOIN passwords p ON p.software_id = s.id
            WHERE p.id = ?";

        $results = Connect::execute($query, [$passwordId])['data'];

        if (count($results) === 0) {
            return ['success' => false, 'message' => 'software not found for given password'];
        }

        return $results[0];
    }

    // Atualizar software
    public static function update(int $id, ?string $name, ?string $icon)
    {
        $fields = [];
        $params = [];

        if ($name !== null) {
            $fields[] = "name = ?";
            $params[] = $name;
        }

        if ($icon !== null) {
            $fields[] = "icon = ?";
            $params[] = $icon;
        }

        if (empty($fields)) {
            return ['success' => false, 'message' => 'no data to update'];
        }

        $params[] = $id;

        $query = "UPDATE softwares SET " . implode(', ', $fields) . " WHERE id = ?";
        $result = Connect::execute($query, $params);

        if (isset($result['action']) && $result['action'] === 'UPDATE') {
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'update failed'];
    }

    // Deletar software
    public static function delete(int $id)
    {
        $query = "DELETE FROM softwares WHERE id = ?";
        $result = Connect::execute($query, [$id]);

        if (isset($result['affectedRows']) && $result['affectedRows'] > 0) {
            return ['success' => true];
        }

        return ['success' => false, 'message' => 'software not found'];
    }

    // Getters e Setters
    public function getId(): ?int { return $this->id; }
    public function setId(?int $id): void { $this->id = $id; }

    public function getName(): ?string { return $this->name; }
    public function setName(?string $name): void { $this->name = $name; }

    public function getIcon(): ?string { return $this->icon; }
    public function setIcon(?string $icon): void { $this->icon = $icon; }
}
