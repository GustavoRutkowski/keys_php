<?php

namespace Source\Models;

use Exception;
use Source\Utils\Connect;
use Source\Utils\JWTToken;

class Password
{
    public $TABLE = 'passwords';

    private $id;
    private $value;
    private $user_id;
    private $software_id;

    public function __construct(
        ?int $id,
        ?string $value = null,
        ?int $user_id = null,
        ?int $software_id = null
    )
    {
        $this->id = $id;
        $this->value = $value;
        $this->user_id = $user_id;
        $this->software_id = $software_id;
    }

    // Criar senha
    public static function create(string $token, string $value, ?int $software_id = null)
    {
        $jwt = JWTToken::from($token);
        
        if ($jwt === null) throw new Exception('invalid or expired token');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('invalid or expired token');

        $user_id = $res['decoded_token']->id;

        $query = "INSERT INTO passwords (value, user_id, software_id) VALUES (?, ?, ?)";
        $result = Connect::execute($query, [$value, $user_id, $software_id]);

        // var_dump($result);

        if (array_key_exists("insertId", $result) === false)
            throw new Exception('password not created');
        
        return [ 'insertId' => $result['insertId'] ];
    }

    // Buscar todas as senhas do usuário
    public static function getAllByUser(string $token)
    {
        $jwt = JWTToken::from($token);
        
        if ($jwt === null) throw new Exception('invalid or expired token');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('invalid or expired token');

        $user_id = $res['decoded_token']->id;

        $query = "SELECT id, value, software_id FROM passwords WHERE user_id = ?";
        $results = Connect::execute($query, [$user_id])['data'];

        return $results;
    }


    // Buscar senha por ID
    public static function getById(string $token, int $id)
    {
        $jwt = JWTToken::from($token);
        
        if ($jwt === null) throw new Exception('invalid or expired token');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('invalid or expired token');

        $user_id = $res['decoded_token']->id;

        $query = "SELECT id, value, software_id FROM passwords WHERE id = ? AND user_id = ?";
        $results = Connect::execute($query, [$id, $user_id])['data'];

        if (count($results) === 0) return [ 'success' => false, 'message' => 'password not found' ];

        return $results[0];
    }

    // Atualizar senha
    public static function update(string $token, int $id, ?string $value, ?int $software_id)
    {
        $jwt = JWTToken::from($token);
        
        if ($jwt === null) throw new Exception('invalid or expired token');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('invalid or expired token');

        $user_id = $res['decoded_token']->id;

        $fields = [];
        $params = [];

        if ($value !== null) { $fields[] = 'value = ?'; $params[] = $value; }
        if ($software_id !== null) { $fields[] = 'software_id = ?'; $params[] = $software_id; }

        if (empty($fields)) throw new Exception('no data to update');

        $params[] = $id;
        $params[] = $user_id;

        $query = "UPDATE passwords SET " . join(',', $fields) . " WHERE id = ? AND user_id = ?";
        $result = Connect::execute($query, $params);

        if (isset($result['action']) === false || $result['action'] !== 'UPDATE')
            throw new Exception('update failed');
        
        return [ 'success' => true ];
    }

    // Deletar senha
    public static function delete(string $token, int $id)
    {
        $jwt = JWTToken::from($token);
        
        if ($jwt === null) throw new Exception('invalid or expired token');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('invalid or expired token');

        $user_id = $res['decoded_token']->id;

        $query = "DELETE FROM passwords WHERE id = ? AND user_id = ?";
        $result = Connect::execute($query, [ $id, $user_id ]);

        if (isset($result['affectedRows']) === false || $result['affectedRows'] <= 0)
            throw new Exception('password not found or not owned by user');
        
        return [ $result ];
    }


    // Getters e Setters
    public function getId(): ?int 
    { 
        return $this->id; 
    }
    public function setId(?int $id): void 
    {
        $this->id = $id; 
    }
    public function getValue(): ?string 
    {
        return $this->value; 
    }
    public function setValue(?string $value): void 
    {
        $this->value = $value;
    }
    public function getUserId(): ?int 
    {
        return $this->user_id; 
    }
    public function setUserId(?int $user_id): void 
    { 
        $this->user_id = $user_id;
    }
    public function getSoftwareId(): ?int 
    {
        return $this->software_id; 
    }
    public function setSoftwareId(?int $software_id): void 
    {
        $this->software_id = $software_id; 
    }
}
