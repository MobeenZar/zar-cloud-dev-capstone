//Author Mobeen Zar
import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ContactItem } from "../models/ContactItem";
import { createLogger } from "../utils/logger";

const logger = createLogger("auth");

export class ContactAccess {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly contactsTable = process.env.CONTACTS_TABLE,
    private readonly avaibleIndex = process.env.AVAILABLE_INDEX,
    private readonly bucketName = process.env.CONTACTS_IMAGES_S3_BUCKET
  ) {}

  async getAvailableContacts(): Promise<ContactItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.contactsTable,
        IndexName: this.avaibleIndex,
        KeyConditionExpression: "available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
      })
      .promise();

    logger.info(`Found ${result.Count} available Contacts to show on home page`);

    const items = result.Items;

    return items as ContactItem[];
  }

  async getUserContacts(userId: string): Promise<ContactItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.contactsTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
      })
      .promise();

    logger.info(`Found ${result.Count} total contacts for user ${userId}`);

    const items = result.Items;

    return items as ContactItem[];
  }

  async createContact(cont: ContactItem): Promise<ContactItem> {
    await this.docClient
      .put({
        TableName: this.contactsTable,
        Item: cont,
      })
      .promise();

    logger.info(`Saved new contact ${cont.contactId} for user ${cont.userId}`);

    return cont;
  }

  async updateContact(name: string, description: string, phone: string, address: string, userId: string, contactId: string ) {
    await this.docClient
    .update({
      TableName: this.contactsTable,
      Key: {
        userId,
        contactId,
      },
      UpdateExpression: "set #description = :description, #name = :name, #phone = :phone, #address = :address",
        ExpressionAttributeValues: {
          ":description": description,
          ":name": name,
          ":phone": phone,
          ":address": address,
        },
        ExpressionAttributeNames: {
          "#description": "description",
          "#name": "name",
          "#phone": "phone",
          "#address": "address",
          
        },
      }
      )
      .promise();

    logger.info(`Updated contact ${contactId} for user ${userId} desc: ${description} name: ${name} `);

    // return {
    //   available: "true",
    //   createdAt: "string",
    //   userId,
    //   contactId,
    //   name,
    //   description}
  }

  async hideContact(userId: string, contactId: string) {
    await this.docClient
      .update({
        TableName: this.contactsTable,
        Key: {
          userId,
          contactId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "false",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async availableContact(userId: string, contactId: string) {
    await this.docClient
      .update({
        TableName: this.contactsTable,
        Key: {
          userId,
          contactId,
        },
        UpdateExpression: "set #available = :available",
        ExpressionAttributeValues: {
          ":available": "true",
        },
        ExpressionAttributeNames: {
          "#available": "available",
        },
      })
      .promise();
  }

  async deleteContact(userId: string, contactId: string) {
    await this.docClient
      .delete({
        TableName: this.contactsTable,
        Key: {
          userId,
          contactId,
        },
      })
      .promise();

    logger.info(`Deleted contact ${contactId}`);
  }

  async updateUrl(userId: string, contactId: string) {
    await this.docClient
      .update({
        TableName: this.contactsTable,
        Key: {
          userId,
          contactId,
        },
        UpdateExpression: "set #attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues: {
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${contactId}`,
        },
        ExpressionAttributeNames: {
          "#attachmentUrl": "attachmentUrl",
        },
      })
      .promise();
  }
}
