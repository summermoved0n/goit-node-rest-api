import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();

  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} no found.`);
  }

  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found.`);
  }

  res.json({
    message: "Delete success",
  });
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body);

  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, `Contuct with id=${id} not found.`);
  }

  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
};
