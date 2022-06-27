import express from 'express';

import {postOrders} from '../controllers/orders.js';

const router = express.Router();

router.post('/', postOrders);

export default router;