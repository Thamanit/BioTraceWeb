import express from "express";
import {
    getCompanyPosition,
    createCompanyPosition,
    deleteCompanyPosition,
    updateCompanyPosition
} from "../controllers/companyPosition.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/:id/positions/', verifyToken, getCompanyPosition);

router.post('/:id/positions/', verifyToken, createCompanyPosition);

router.put('/:id/positions/:positionId', verifyToken, updateCompanyPosition);

router.delete('/:id/positions/:positionId', verifyToken, deleteCompanyPosition);

export default router;
