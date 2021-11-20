import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateContactRequest } from "../../requests/CreateContactRequest";
import { getUserId } from "../utils";
import { updateContact } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newContact: CreateContactRequest = JSON.parse(event.body);
    const userId = getUserId(event);
    const contactId = event.pathParameters.contactId;

    logger.info(`Received request for updateing Contact details for the user ${userId}...body: ` + JSON.stringify(newContact));

    const item = await updateContact(newContact, userId, contactId);

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
