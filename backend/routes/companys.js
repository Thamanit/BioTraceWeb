import express from "express";
import {
  getCompanys,
  getCompanyById,
  verifyCompany,
  rateCompany,
  createCompany,
  getUnverifiedCompanys,
  getCompanyEnrollmentById
} from "../controllers/company.js";
import {
  enrollCompany,
  getCompanyEnrollments
} from "../controllers/companyEnrollment.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", getCompanys);

router.post('/', verifyToken, createCompany);

router.get('/getUnverified', verifyAdmin, getUnverifiedCompanys);

// Route to manage company ratings
router.post('/:id/rate', rateCompany);

// Route to get a specific company by ID (company profile)
router.get('/:id', getCompanyById);

router.get('/:id/enrollments', verifyUser, getCompanyEnrollmentById);

router.post('/:id/enroll', verifyUser, enrollCompany);

// Route to verify a company (Admin only)
router.patch('/:id/verify', verifyAdmin, verifyCompany);

router.post('/:id/enroll', verifyUser, enrollCompany);

router.get('/enrollments', verifyUser, getCompanyEnrollments);

export default router;
