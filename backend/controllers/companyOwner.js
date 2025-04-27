import Company from "../models/Company.js";
import RBAC from "../models/RBAC.js";
import CompanyEnrollment from "../models/CompanyEnrollment.js";
import { createError } from "../utils/error.js";
import User from "../models/User.js";

export const hasCompanies = async (req, res, next) => {
    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectType: 'Company',
        role: 'CompanyOwner',
    });

    if (!RBACEntry) {
        return res.status(403).json({ message: 'You are not authorized to view this resource' });
    }

    return res.status(200).json({ message: 'You have access to this resource' });
}

export const getCompanys = async (req, res, next) => {
    const RBACEntry = await RBAC.find({
        userID: req.user.id,
        objectType: 'Company',
        role: 'CompanyOwner',
    });

    if (!RBACEntry) {
        return res.status(403).json({ message: 'You are not authorized to view this resource' });
    }

    const companyIDs = RBACEntry.map(entry => entry.objectID);

    try {
        const companys = await Company.find({
            _id: { $in: companyIDs },
        });
        res.status(200).json(companys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCompanyEnrollments = async (req, res, next) => {
    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectType: 'Company',
        role: 'CompanyOwner',
    });

    if (!RBACEntry) {
        return res.status(403).json({ message: 'You are not authorized to view this resource' });
    }

    const companyID = RBACEntry.objectID;

    try {
        const enrollments = await CompanyEnrollment.find({ companyID })
        .populate({
            path: 'userID',
            select: 'username email', // Select only username and email from User
            model: User
        });
        return res.status(200).json(enrollments);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const getSpecificCompanyEnrollments = async (req, res, next) => {
    const companyID = req.params.id;

    if (!companyID) {
        return res.status(400).json({ message: 'Company ID is required' });
    }

    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectType: 'Company',
        role: 'CompanyOwner',
        objectID: companyID,
    });

    if (!RBACEntry) {
        return res.status(403).json({ message: 'You are not authorized to view this resource' });
    }
    try {
        const enrollments = await CompanyEnrollment.find({ companyID })
        .populate({
            path: 'userID',
            select: 'username email', // Select only username and email from User
            model: User
        });
        return res.status(200).json(enrollments);
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCompanyById = async (req, res, next) => {
    const companyId = req.params.id;

    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to view this company'));
    }

    try {
        const company = await Company.findById(companyId).populate('positions');;
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (err) {
        next(err);
    }
}

export const updateCompany = async (req, res, next) => {
    const companyId = req.params.id;

    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to update this company'));
    }

    const { name, address, phone, email, image } = req.body;

    try {
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { name, address, phone, email, image },
            { new: true }
        );
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(updatedCompany);
    } catch (err) {
        next(err);
    }
}

export const updateCompanyEnrollment = async (req, res, next) => {
    const enrollmentId = req.params.enrollmentid;
    const companyId = req.params.id;
    const { status } = req.body;

    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to update this company'));
    }

    try{
        const enrollment = await CompanyEnrollment.findByIdAndUpdate(
            enrollmentId,
            { status },
            { new: true }
        );
        if(!enrollment){
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        if(enrollment.status === 'Accepted'){
            const newRBAC = new RBAC({
                userID: enrollment.userID,
                objectID: enrollment.companyID,
                objectType: 'Company',
                role: 'CompanyMember',
            });
            await newRBAC.save();
        }
        return res.status(200).json(enrollment);
    }
    catch(err){
        next(err);
    }
}