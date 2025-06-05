<?php

namespace Source\Models;

use Source\Utils\Connect;
use Source\Utils\JWTToken;
use Exception;

class User
{
    public $TABLE = 'users';

    private $id;
    private $name;
    private $email;
    private $password;
    private $photo;

    public function __construct(
        ?int $id,
        ?string $name = null,
        ?string $email = null,
        ?string $password = null,
        ?string $photo = null
    )
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->photo = $photo;
    }

    // CRUD:
    public static function create($name, $email, $main_pass) {
        if (!$name || !$email || !$main_pass) throw new Exception('you left required fields blank');

        $countQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        $firstRow = Connect::execute($countQuery, [$email])['data'][0];

        if ($firstRow['count'] > 0) throw new Exception('email already exists');

        $query = 'INSERT INTO users (name, email, main_pass) VALUES (?, ?, ?)';
        $hashedPassword = password_hash($main_pass, PASSWORD_DEFAULT);

        $createdUser = Connect::execute($query, [$name, $email, $hashedPassword]);
        return [ 'insertId' => $createdUser['insertId'] ];
    }

    public static function getByToken(string $token) {
        $jwt = JWTToken::from($token);

        if ($jwt === null) throw new Exception('invalid or malformed token');
        
        $res = JWTToken::verify($jwt);
        
        if ($res['valid'] === false) throw new Exception($res['message']);
        
        $id = $res['decoded_token']->id;

        try {
            return User::getById($id);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }


    public static function getById(int $id) {
        if (!$id) throw new Exception('id is required!');

        $query = 'SELECT id, name, email, picture FROM users WHERE id = ?';
        $results = Connect::execute($query, [ $id ])['data'];

        if (count($results) === 0) throw new Exception('user not found');

        $user = $results[0];
        return $user;
    }

    public static function update(string $token, ?string $name = null, ?string $main_pass = null, ?string $picture = null) {
        if (!$token) throw new Exception('token is required!');

        $id = null;

        $jwt = JWTToken::from($token);

        if ($jwt === null) throw new Exception('expired or invalid token!');

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) throw new Exception('expired or invalid token!');
        
        $id = $res['decoded_token']->id;
        
        if (!$name && !$main_pass && !$picture) throw new Exception('to update, you must pass at least one argument');

        $query = 'UPDATE users SET';
        $data = [];

        $queryFields = [];

        if ($name !== null) { $queryFields[] = ' name = ?'; $data[] = $name; }
        if ($picture !== null && $picture !== '') { $queryFields[] = ' picture = ?'; $data[] = $picture; }

        if ($main_pass !== null) {
            $queryFields[] = ' main_pass = ?';

            $hashedPassword = password_hash($main_pass, PASSWORD_DEFAULT);
            $data[] = $hashedPassword;
        }

        $query .= implode(',', $queryFields);
        $query .= ' WHERE id = ?';

        $data[] = $id;

        var_dump($query);

        $result = Connect::execute($query, $data);

        // var_dump($result['action']);

        if ($result['action'] !== 'UPDATE') throw new Exception('update failed');
        return [ 'success' => true ];
    }
  
    public static function login($email, $main_pass) {
        if (!$email || !$main_pass) throw new Exception('you left required fields blank');

        $query = 'SELECT id, name, email, main_pass FROM users WHERE email = ?';
        
        $results = Connect::execute($query, [$email])['data'];
        $userNotFound = count($results) === 0;

        if ($userNotFound) throw new Exception('invalid attempt');
        
        $user = $results[0];

        $passwordIsValid = password_verify($main_pass, $user['main_pass']);

        if (!$passwordIsValid) throw new Exception('invalid attempt');

        $token = new JWTToken($user);
        return [
            'token' => $token->getToken(),
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ];
    }

    // Getters & Setters
    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): void
    {
        $this->photo = $photo;
    }
}