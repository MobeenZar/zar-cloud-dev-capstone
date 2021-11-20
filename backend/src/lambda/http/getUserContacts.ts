import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserContacts } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";
import { getUserId } from "../utils";

const logger = createLogger("auth");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);

    logger.info(`Received request for retrieve all contacts for the user ${userId}`);

    const items = await getUserContacts(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
