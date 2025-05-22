<?php

namespace Source\Models;

use Source\Utils\Connect;
use Source\Utils\JWTToken;

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
        if (!$name || !$email || !$main_pass) {
            return [ 'message' => 'name, email and main_pass are required!' ];
        }

        $countQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        $firstRow = Connect::execute($countQuery, [$email])['data'][0];

        if ($firstRow['count'] > 0) return [ 'message' => 'email already exists' ];

        $query = 'INSERT INTO users (name, email, main_pass) VALUES (?, ?, ?)';
        $hashedPassword = password_hash($main_pass, PASSWORD_DEFAULT);

        $createdUser = Connect::execute($query, [$name, $email, $hashedPassword]);
        return [ 'insertId' => $createdUser['insertId'] ];
    }

    public static function getByToken(string $token) {
        $jwt = JWTToken::from($token);

        if ($jwt !== null) {
            $res = JWTToken::verify($jwt);
            
            if ($res['valid']) {
                $id = $res['decoded_token']->id;
                return User::getById($id);
            }

            return [ 'message' => $res['message'] ];
        }

        return [ 'message' => 'Invalid or malformed token' ];
    }


    public static function getById(int $id) {
        if (!$id) {
            return [ 'message' => 'id is required!' ];
        }

        $query = 'SELECT id, name, email, picture FROM users WHERE id = ?';

        $results = Connect::execute($query, [ $id ])['data'];

        if (count($results) === 0) {
            return [ 'message' => 'user not found' ];
        }

        $user = $results[0];
        return $user;
    }

    public static function update(string $token, ?string $name, ?string $main_pass, ?string $picture) {
        if (!$token) return [ 'success' => false, 'message' => 'token is required!' ];
        
        $id = null;

        $jwt = JWTToken::from($token);

        if ($jwt === null) return [ 'success' => false, 'message' => 'expired or invalid token!' ];

        $res = JWTToken::verify($jwt);

        if (!$res['valid']) return [ 'success' => false, 'message' => 'expired or invalid token!' ];
        
        $id = $res['decoded_token']->id;
        
        if (!$name && !$main_pass && !$picture)
        return [ 'success' => false, 'message' => 'to update, you must pass at least one argument' ];

        $query = 'UPDATE users SET';
        $data = [];

        if ($name) { $query .= ' name = ?,'; $data[] = $name; }
        if ($picture && $picture !== '') { $query .= ' picture = ?,'; $data[] = $picture; }

        if ($main_pass) {
            $query .= ' main_pass = ?';

            $hashedPassword = password_hash($main_pass, PASSWORD_DEFAULT);
            $data[] = $hashedPassword;
        }

        $query .= ' WHERE id = ?';
        $data[] = $id;

        $result = Connect::execute($query, $data);

        if ($result['action'] === 'UPDATE') return [ 'success' => true ];
        return [ 'success' => false, 'message' => 'update failed' ]; 
    }
  
    public static function login($email, $main_pass) {
        if (!$email || !$main_pass)
        return [ 'message' => 'email and main_pass are required!' ];

        $query = 'SELECT * FROM users WHERE email = ?';
        
        $results = Connect::execute($query, [$email])['data'];
        $userNotFound = count($results) === 0;

        if ($userNotFound) return [ 'success' => false, 'message' => 'invalid attempt' ];
        
        $user = $results[0];

        $passwordIsValid = password_verify($main_pass, $user['main_pass']);

        if (!$passwordIsValid) return [ 'success' => false, 'message' => 'invalid attempt' ];

        $token = new JWTToken([ 'id' => $user['id'], 'email' => $user['email'] ]);
        return [ 'success' => true, 'token' => $token->getToken() ];
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