import Contact from "../models/Contacts.js";

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt");

export const addContact = (data) => Contact.create(data);

export const getContactById = (id) =>
  Contact.findById(id, "-createdAt -updatedAt");

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const updateStatusContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data);
