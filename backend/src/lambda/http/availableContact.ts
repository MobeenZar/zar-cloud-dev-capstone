import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../utils";
import { availableContact } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";

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
      `Received request for making contact ${contactId} visible for the user ${userId}...`
    );

    await availableContact(userId, contactId);

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
