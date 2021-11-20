import { Contact } from '../types/Contact'
import { apiEndpoint } from '../config'
import Axios from 'axios'

  // GET - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/available
  // GET - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/me
  // POST - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts
  // PATCH - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/{contactId}/update
  // PATCH - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/{contactId}/{userId}/hide
  // PATCH - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/{contactId}/available
  // DELETE - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/{contactId}
  // POST - https://k7opuy1qo1.execute-api.us-east-1.amazonaws.com/dev/contacts/{contactId}/attachment

export async function getAvailableContacts(idToken: string): Promise<Contact[]> {
  console.log('Fetching available contacts')

  const response = await Axios.get(`${apiEndpoint}/contacts/available`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Contacts:', response.data)
  return response.data.items
}

export async function getMyContacts(idToken: string): Promise<Contact[]> {
  console.log('Fetching my Contacts')

  const response = await Axios.get(`${apiEndpoint}/contacts/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Contacts:', response.data)
  return response.data.items
}

export async function createContact(
  idToken: string,
  name: string,
  description: string,
  address: string,
  phone: string
): Promise<Contact> {
  const response = await Axios.post(
    `${apiEndpoint}/contacts`,
    JSON.stringify({
      name,
      description,
      address,
      phone
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function updateContact(
  idToken: string,
  contactId: string,
  name: string,
  description: string,
  address: string,
  phone: string
): Promise<void> {
  
  await Axios.patch(
    `${apiEndpoint}/contacts/${contactId}/update`,
    JSON.stringify({
      name,
      description,
      address,
      phone
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function hideContact(
  idToken: string,
  contactId: string,
  userId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/contacts/${contactId}/${userId}/hide`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function availableContact(
  idToken: string,
  contactId: string
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/contacts/${contactId}/available`,
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteContact(idToken: string, contactId: string): Promise<void> {
  await Axios.delete(`${apiEndpoint}/contacts/${contactId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  contactId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/contacts/${contactId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
