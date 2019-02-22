import express from 'express';
import generateCrud from '../middlewares/generateCrud';
import security from '../middlewares/security';
import routeConfig from '../routeConfig.js';

const router = express.Router();
/**
 * Unprotected routes
 */
router.get('/health-check', async (req, res, next) => res.send('Yo'));
// router.use('/auth', authRoutes);
// security({ router });
/**
 * Partially Protected routes
 */
// cruds
routeConfig.forEach(item => {
  const { endpoint } = item;
  router.use(endpoint, generateCrud(item));
});
security({ router });
/**
 * Protected routes
 */
// other
// Destroy token associated with this user
router.use('/logout', (req, res) => res.send('Logged out successfully'));

export default router;
