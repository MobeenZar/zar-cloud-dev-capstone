import "source-map-support/register";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { APIGatewayProxyResult } from "aws-lambda";
import { getAvailableContacts } from "../../businessLogic/contactsBusLogic";
import { createLogger } from "../../utils/logger";

const logger = createLogger("auth");

export const handler = middy(
  async (): Promise<APIGatewayProxyResult> => {
    logger.info(
      `Received request for getting all contcts with show flag = true`
    );

    const items = await getAvailableContacts();

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
