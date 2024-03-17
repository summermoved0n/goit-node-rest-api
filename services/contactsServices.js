import Contact from "../models/Contacts.js";

export const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, "-owner -createdAt -updatedAt", query);

export const addContact = (data) => Contact.create(data);

export const getContactById = (id) =>
  Contact.findById(id, "-owner -createdAt -updatedAt");

export const removeContact = (id) =>
  Contact.findByIdAndDelete(id, { projection: "-createdAt -updatedAt" });

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { select: "-createdAt -updatedAt" });

export const updateStatusContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { select: "-createdAt -updatedAt" });
