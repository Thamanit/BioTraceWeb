import CompanyPosition from '../models/Position.js';
import Company from '../models/Company.js';
import RBAC from '../models/RBAC.js';
import { createError } from "../utils/error.js";

export const getCompanyPosition = async (req, res, next) => {
    const companyId = req.params.id;
    try {
        const positions = await CompanyPosition.find({ companyId: companyId })
        return res.status(200).json(positions);
    } catch (err) {
        next(err);
    }
};

export const getCompanyPositionById = async (req, res, next) => {
    const companyId = req.params.id;
    const positionId = req.params.positionId;

    try {
        const position = await CompanyPosition.findOne({ companyId: companyId, _id: positionId });
        return res.status(200).json(position);
    }
    catch (err) {
        next(err);
    }
};

export const createCompanyPosition = async (req, res, next) => {
    const companyId = req.params.id;

    // Check RBAC permissions
    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to view this company'));
    }

    const { name } = req.body;

    try {
        // Check if a position with the same name already exists for the company
        const existingPosition = await CompanyPosition.findOne({ companyId, name });
        if (existingPosition) {
            return res.status(400).json({
                success: false,
                message: `Position with name "${name}" already exists.`,
            });
        }

        // Create a new position
        const position = await CompanyPosition.create({
            companyId: companyId,
            isOpen: false,
            name: name,
        });

        // Add the position to the company
        await Company.findByIdAndUpdate(companyId, {
            $push: { positions: position._id },
        });

        return res.status(201).json({
            success: true,
            message: 'Position created successfully!',
            position,
        });
    } catch (err) {
        next(err);
    }
};

export const updateCompanyPosition = async (req, res, next) => {
    const companyId = req.params.id;

    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to view this company'));
    }

    const positionId = req.params.positionId;
    const {isOpen, name} = req.body;
    try {
        const positions = await CompanyPosition.updateOne(
            { companyId: companyId, _id: positionId },
            { $set: { isOpen: isOpen || false, name: name } }
        );
        return res.status(200).json(positions);
    } catch (err) {
        next(err);
    }
};

export const deleteCompanyPosition = async (req, res, next) => {
    const companyId = req.params.id;

    // Check RBAC permissions
    const RBACEntry = await RBAC.findOne({
        userID: req.user.id,
        objectID: companyId,
    });

    if (!RBACEntry || RBACEntry.role !== 'CompanyOwner') {
        return next(createError(403, 'You are not authorized to view this company'));
    }

    const positionId = req.params.positionId;

    try {
        // Find the position to ensure it exists and belongs to the company
        const position = await CompanyPosition.findOne({ _id: positionId, companyId });
        if (!position) {
            return res.status(404).json({
                success: false,
                message: 'Position not found or does not belong to this company.',
            });
        }

        // Delete the position from the `positions` collection
        await CompanyPosition.deleteOne({ _id: positionId });

        // Remove the position from the company's `positions` array
        await Company.findByIdAndUpdate(companyId, {
            $pull: { positions: positionId },
        });

        return res.status(200).json({
            success: true,
            message: 'Position deleted successfully.',
        });
    } catch (err) {
        next(err);
    }
};