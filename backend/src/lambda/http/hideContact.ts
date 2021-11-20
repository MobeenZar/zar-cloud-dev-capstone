import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hideContact } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const contactId = event.pathParameters.contactId;
    const userId = getUserId(event);

    if (!contactId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing contactId" }),
      };
    }

    logger.info(
      `Received request hide the contact: ${contactId} for user ${userId}`
    );

    await hideContact(userId, contactId);

    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
