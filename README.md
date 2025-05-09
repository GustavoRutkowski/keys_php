# Gerenciador de Senhas

A ideia geral é ter um aplicativo *JavaScript* que seja capaz de gerências as senhas de determinados usuários. Esse sistema funcionario da seguinte forma:

O usuário definiria uma única senha main, que seria a senha do próprio gerenciador.

Após isso, sempre que ele fosse acessar o gerenciador, seriam listadas todas as suas senhas uma por uma

## Planejamento

### Back-End

#### Banco de Dados (MySQL)

Usuarios
- id INT NN PK AI
- email VARCHAR(255) NN UN
- main_pass VARCHAR(255) NN

Senhas
- id INT NN PK AI
- user_id INT NN FK
- value VARCHAR(255) NN
- referring_to VARCHAR(40) NN
- icon LONGTEXT
- is_deleted BOOL DEFAULT "FALSE"
- timestamp DATETIME NN

### Front-End
Para desenvolver o Front-End irei utilizar HTML, SCSS para os Estilos e TypeScript para os scripts.

## Tarefas:

### Novas Features:
* [ ] - Calcular o nível de segurança de uma senha
* [ ] - Mostrar a segurança da main_pass para o usuário enquanto ele digita

<!-- Saber o Nível de Segurança de cada senha e se ela está sendo reutilizada -->

### Modelagem do Projeto:
* [ ] - A cor base do projeto deve ser roxo
* [ ] - Criar um Docker Compose para o projeto
    * Incluir nesse arquivo tanto o Node.js e MySQL quanto aquela lib open-source para tradução de strings.
* [ ] - Permitir que o WebPack configure o SASS também
* [ ] - Criar um sistema de compartilhamento do '.env' com o front
    * Usar o Mustache ou o Handlebars para fazer isso.
* [ ] - Implementar testes automatizados
* [ ] - Modelar um novo repositório com .gitignore funcional.

### Agora:
1. [ ] - Implementar as features de sessão do usuário
    1. [ ] - Criar o sistema de login
    2. [ ] - Criar o sistema de logout
2. [ ] - Implementar a página de Dashboard
    1. [ ] - Implementar a função para renderizar as senhas
    2. [ ] - Implementar a função de criar uma nova senha
    3. [ ] - Implementar a função de editar uma senha
    4. [ ] - Implementar a função de deletar uma senha
    5. [ ] - Implementar a função de deletar permanentemente uma senha
