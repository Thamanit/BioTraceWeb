import express from "express";
import {
    getCompanys,
    hasCompanies,
    getCompanyEnrollments,
    updateCompany,
    getCompanyById,
    getSpecificCompanyEnrollments,
    updateCompanyEnrollment
} from "../controllers/companyOwner.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/', verifyUser, hasCompanies)

router.get("/companies", verifyUser, getCompanys);

router.get("/company/:id", verifyUser, getCompanyById);

router.put("/company/:id", verifyUser, updateCompany)

router.get("/company/:id/enrollments", verifyUser, getSpecificCompanyEnrollments)

router.put("/company/:id/enrollments/:enrollmentid", verifyToken, updateCompanyEnrollment)

router.get("/enrollments", verifyUser, getCompanyEnrollments);

export default router;
