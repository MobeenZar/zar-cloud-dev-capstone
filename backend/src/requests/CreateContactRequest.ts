export interface CreateContactRequest {
  name: string;
  description: string;
  address: string;
  phone: string;
  file: Buffer;
}
