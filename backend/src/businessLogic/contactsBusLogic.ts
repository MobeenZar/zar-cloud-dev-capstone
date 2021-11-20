import { CreateContactRequest } from "../requests/CreateContactRequest";
import * as uuid from "uuid";
import { ContactItem } from "../models/ContactItem";
import { ContactAccess } from "../dataLayer/contactsAccess";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

const contactAccess = new ContactAccess();

export async function getAvailableContacts(): Promise<ContactItem[]> {
  return await contactAccess.getAvailableContacts();
}

export async function getUserContacts(userId: string): Promise<ContactItem[]> {
  return await contactAccess.getUserContacts(userId);
}

export async function createContact(
  createContactRequest: CreateContactRequest,
  userId: string
): Promise<ContactItem> {
  logger.info("Generating uuid...");

  const itemId = uuid.v4();

  return await contactAccess.createContact({
    available: "true",
    createdAt: new Date().toISOString(),
    userId,
    contactId: itemId,
    name: createContactRequest.name,
    description: createContactRequest.description,
    address: createContactRequest.address,
    phone: createContactRequest.phone,
  });
}

export async function updateContact(
  createContactRequest: CreateContactRequest,
  userId: string,
  contactId: string
) {
 
  let name = createContactRequest.name;
  let description = createContactRequest.description;
  let phone = createContactRequest.phone;
  let address = createContactRequest.address;

  return await contactAccess.updateContact (name, description, phone, address, userId, contactId)
}

export async function hideContact(userId: string, contactId: string) {
  return await contactAccess.hideContact(userId, contactId);
}

export async function availableContact(userId: string, contactId: string) {
  return await contactAccess.availableContact(userId, contactId);
}

export async function deleteContact(userId: string, contactId: string) {
  return await contactAccess.deleteContact(userId, contactId);
}

export async function updateUrl(userId: string, contactId: string) {
  await contactAccess.updateUrl(userId, contactId);
}
