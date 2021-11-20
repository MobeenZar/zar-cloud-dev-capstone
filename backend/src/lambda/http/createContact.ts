import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateContactRequest } from "../../requests/CreateContactRequest";
import { getUserId } from "../utils";
import { createContact } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newContact: CreateContactRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    logger.info(`Received request to create a new contact for the user ${userId}...`);

    const item = await createContact(newContact, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
