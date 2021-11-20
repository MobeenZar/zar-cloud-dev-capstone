import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createLogger } from "../../utils/logger";
import * as AWS from "aws-sdk";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import * as AWSXRay from "aws-xray-sdk";
import { getUserId } from "../utils";
import { updateUrl } from "../../businessLogic/contactsBusLogic";

const logger = createLogger("auth");

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.CONTACTS_IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);

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

    logger.info(`Received request for generating signed URL for contact ${contactId}`);

    await updateUrl(userId, contactId);

    const url = getUploadUrl(contactId);
    
    logger.info("Got the signed URL for the contact. url:" + url);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url,
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);

function getUploadUrl(contactId: string) {
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: contactId,
    Expires: urlExpiration,
  });
}
