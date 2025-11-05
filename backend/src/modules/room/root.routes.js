import express from 'express';
import * as roomController from './room.controller.js';

const router = express.Router();

router.get('/count', roomController.countRooms);
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.patch('/:id/status', roomController.updateRoomStatus);
router.delete('/:id', roomController.deleteRoom);

export default router;