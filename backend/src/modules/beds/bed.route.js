import express from 'express';
import * as bedController from './bed.controller.js';

const router = express.Router();

router.get('/count', bedController.countBeds);
router.get('/', bedController.getAllBeds);
router.get('/:id', bedController.getBedById);
router.post('/', bedController.createBed);
router.put('/:id', bedController.updateBed);
router.patch('/:id/status', bedController.updateBedStatus);
router.delete('/:id', bedController.deleteBed);

export default router;