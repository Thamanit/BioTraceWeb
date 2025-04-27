import Company from "../models/Company.js";
import RBAC from "../models/RBAC.js";
import CompanyEnrollment from "../models/CompanyEnrollment.js";
import { createError } from "../utils/error.js";

export const getCompanys = async (req, res, next) => {
    try {
        const companys = await Company.find({
            isVerified: true,
        });
        res.status(200).json(companys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUnverifiedCompanys = async (req, res, next) => {
    try {
        const companys = await Company.find({
            isVerified: false,
        });
        res.status(200).json(companys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const createCompany = async (req, res, next) => {
    try {
        const { name, address, phone, image } = req.body;

        const email = req.user.email;

        // Validate required fields
        if (!name || !address || !phone || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new company instance
        const newCompany = new Company({
            name,
            address,
            phone,
            email,
            image,
            ownerID: req.user.id,
        });

        // Save company to the database
        const savedCompany = await newCompany.save();

        // Create a new RBAC entry for the company
        const newRBAC = new RBAC({
            userID: req.user.id,
            objectID: savedCompany._id,
            objectType: 'Company',
            role: 'CompanyOwner',
        });

        // Save the RBAC entry
        await newRBAC.save();

        return res.status(201).json(savedCompany);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

export const getCompanyById = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        // Find the company and populate the positions field
        const company = await Company.findById(companyId).populate('positions');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export const getCompanyEnrollmentById = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        const enrollments = await CompanyEnrollment.find({ companyID: companyId, userID: req.user.id });
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const verifyCompany = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { isVerified: true }, // Mark as verified
            { new: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const rateCompany = async (req, res, next) => {
    const companyId = req.params.id;
    const { rating } = req.body;

    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const companyRating = company.ratings || [];

        // Check if the user has already rated the company
        const existingRating = companyRating.find(
            (rating) => rating.userId === req.user.id
        );

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this company' });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            {
                ratings: [...companyRating, { userId: req.user.id, rating }],
            },
            { new: true }
        );

        res.status(200).json(updatedCompany);
    } catch (err) {
        next(err);
    }
};
