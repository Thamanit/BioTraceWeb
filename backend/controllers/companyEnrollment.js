import Company from "../models/Company.js";
import CompanyEnrollment from "../models/CompanyEnrollment.js";
import RBAC from "../models/RBAC.js";
import User from "../models/User.js";

export const getCompanyEnrollments = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const enrollments = await CompanyEnrollment.find({ userID: userId })
            .populate({
                path: 'userID',
                select: 'username email', // Select only username and email from User
                model: User
            });
        return res.status(200).json(enrollments);
    } catch (err) {
        next(err);
    }
};
export const enrollCompany = async (req, res, next) => {
    const companyId = req.params.id;
    const userId = req.user.id;

    const { positionId } = req.body;

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        const enrollment = await CompanyEnrollment.findOne({
            companyID:
                companyId, userID: userId, positionId: positionId
        });
        if (enrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this company' });
        }
        const newEnrollment = new CompanyEnrollment({
            companyID: companyId,
            userID: userId,
            status: 'Pending',
            positionId: positionId
        });
        await newEnrollment.save();
        return res.status(200).json(newEnrollment);
    }
    catch (err) {
        next(err);
    }
};