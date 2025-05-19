import { Router } from 'express';
import UsersRoutes from './routes/users.js';
import validateUser from './middlewares/validate-user.js';
import validatePassword from './middlewares/validate-password.js';
import validatePasswordsMatch from './middlewares/validate-passwords-match.js';
import verifyToken from './middlewares/verify-token.js';

const router = Router();
 
router.post('/users', validateUser, validatePasswordsMatch, UsersRoutes.createUser);
router.post('/users/:id/passwords', validatePassword, UsersRoutes.createPassword);

router.get('/users', UsersRoutes.getAll); // N
router.get('/users/:id', UsersRoutes.getUser);
// /users/user
router.get('/users/:id/passwords', UsersRoutes.getAllPasswordsFrom);
// /users/user/passwords
router.get('/users/:userId/passwords/:passId', UsersRoutes.getPasswordFrom); // N

router.put('/users/:id', validateUser, UsersRoutes.updateUser);
// /users/user
router.put('/users/:userId/passwords/:passId', validatePassword, UsersRoutes.updatePasswordFrom);
// /users/user/passwords/:passId

router.delete('/users/:id', UsersRoutes.deleteUser); // N
router.delete('/users/:userId/passwords/:passId', UsersRoutes.deletePasswordFrom);

router.post('/login', validateUser, UsersRoutes.login);
router.post('/logout', verifyToken, UsersRoutes.logout);

export default router;
