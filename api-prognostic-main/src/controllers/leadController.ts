import { Request, ResponseToolkit } from "@hapi/hapi";
import Lead from "../models/Lead";
import { ILead } from "../interfaces/ILead";
import { Op } from "sequelize";
import { parse } from 'csv-parse/sync';

export const createLead = async (request: Request, h: ResponseToolkit) => {
  try {
    const payload = request.payload as ILead;

    const lead = await Lead.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      source: payload.source,
    });

    return h.response(lead).code(201);
  } catch (error) {
    console.error("Error creating lead:", error);
    return h.response({ message: "Error creating lead" }).code(500);
  }
};



export const getLeadById = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;

  try {
    const lead = await Lead.findByPk(id);
    if (!lead) return h.response({ message: "Lead not found" }).code(404);

    return h.response(lead).code(200);
  } catch (error) {
    console.error("Error fetching lead:", error);
    return h.response({ message: "Error fetching lead" }).code(500);
  }
};

export const updateLead = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;
  const payload = request.payload as Partial<ILead>;

  try {
    const lead = await Lead.findByPk(id);
    if (!lead) return h.response({ message: "Lead not found" }).code(404);

    await lead.update(payload);
    return h.response({ message: "Lead updated successfully" }).code(200);
  } catch (error) {
    console.error("Error updating lead:", error);
    return h.response({ message: "Error updating lead" }).code(500);
  }
};

export const deleteLead = async (request: Request, h: ResponseToolkit) => {
  const { id } = request.params;

  try {
    const lead = await Lead.findByPk(id);
    if (!lead) return h.response({ message: "Lead not found" }).code(404);

    await lead.destroy();
    return h.response({ message: "Lead deleted successfully" }).code(200);
  } catch (error) {
    console.error("Error deleting lead:", error);
    return h.response({ message: "Error deleting lead" }).code(500);
  }
};


export const getLeads = async (request: Request, h: ResponseToolkit) => {
  try {
    const { page = 1, limit = 10, source, email } = request.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

   
    const filters: any = {};
    if (source) filters.source = source; 
    if (email) filters.email = { [Op.like]: `%${email}%` };
    const { rows: leads, count: total } = await Lead.findAndCountAll({
      where: filters,
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]], 
    });

    const response = {
      data: leads,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return h.response(response).code(200);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return h.response({ message: "Error fetching leads" }).code(500);
  }
};

export const importLeadsFromCSV = async (request: Request, h: ResponseToolkit) => {
  try {
    const file = request.payload as { csv: string };

    if (!file.csv) {
      return h.response({ message: 'No CSV file provided' }).code(400);
    }

    const csvContent = file.csv;
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Validate incoming records
    const validRecords = records.filter((record: any) => {
      return record.firstName && record.lastName && record.Email;
    });

    if (validRecords.length === 0) {
      return h.response({ message: 'No valid records to import' }).code(400);
    }

    const createdLeads = await Lead.bulkCreate(
      validRecords.map((record: any) => ({
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.Email,
        phone: record.Phone,
        source: record.Source || 'CSV Import',
      })),
      {
        validate: true,
        returning: true,
      }
    );

    return h.response({
      message: 'Leads imported successfully',
      count: createdLeads.length,
      leads: createdLeads,
    }).code(201);
  } catch (error: any) {
    console.error('Error importing leads:', error.errors || error.message);
    return h.response({ 
      message: 'Error importing leads',
      error: error.errors ? error.errors.map((e: any) => e.message) : error.message,
    }).code(500);
  }
};



