
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

//const jwksUrl = 'https://xxx.auth0.com/.well-known/jwks.json'
//const jwksUrl = 'https://dev-0h0qrtq5.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJdNuHbzAYlE3RMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi0waDBxcnRxNS51cy5hdXRoMC5jb20wHhcNMjExMTExMDU1NDM0WhcN
MzUwNzIxMDU1NDM0WjAkMSIwIAYDVQQDExlkZXYtMGgwcXJ0cTUudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtPyeuIbw1G0rIFoa
aJ/yxuHiWOAqHJ5RmC7WgrMGh7pe1bKhQi3JuLleEIFgPpbSkXS11Ws5oDzsecFq
vU/7yNF1aUtHTPfXQAonF9VEdTYs8OjNzRtPylKcwObD0EMqZQVKTXz+uGULVYPc
2FmmTr0sLQ0pCccodZ4gomAsh4/DTO+c+c3bvub4Jm3F4Mm7DesFWGU00G1zoDlD
DDU81eSAP8VQuRa8wOUUovsYWv7zOu66cRDugpRVQO2BT+vZSBKfeBZ5sXLpO7fg
cGpkyQuhD+dDO9bHD1eXx9ZAAS6IOHt2qJDXRDZNaUpRl9t9JKTG8uIpiniYOJbc
XBLo/wIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQCC4GOaCeK
vFxYh7jwHrK+TGC8TzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AGpJYar8DVmSvJESQkNiSWEw2WPQrqEhHzVxfOKQQHA4ja0zmivTO4xc1stRxEg2
G+PhV97SQSrnvNaoe8N4hmZAMpf7zcYmK7QXI1fwWfBczfIKt8YcwZQW97QUfQet
qaIij0ZTn6tGZyMBuUflvswmxZqCHkeR3nzbwg4jMn5YSSB9WKrATULUm1DysPbv
jnYfmcmJYvg1VB0br8w+D3BvpwntiEf/hUG4I+p4sgUrJCMuuJJKVstIV2VQdY4p
CyW9KOxflz9UMFNFYgpBaz39eQ3uGhZx60JvuFMCJ3Nq9NmRq5NxzclprNhkIRe2
bA2kBGiGR/nGg+G8LhwBqOE=
-----END CERTIFICATE-----
`

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  logger.info('Verifying token...')

  const token = getToken(authHeader)
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
//Below original
  //const res = await Axios.get(jwksUrl)

  // const pemData = res['data']['keys'][0]['x5c'][0]
  // const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`

  // return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}




// import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
// import 'source-map-support/register'
// import { verify } from 'jsonwebtoken'
// import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
// import { JwtPayload } from '../../auth/JwtPayload'

// const logger = createLogger('auth')

// const jwksUrl = 'https://dev-0h0qrtq5.us.auth0.com/.well-known/openid-configuration'

// export const handler = async (
//   event: CustomAuthorizerEvent
// ): Promise<CustomAuthorizerResult> => {
//   logger.info('Authorizing a user', event.authorizationToken)
//   try {
//     const jwtToken = await verifyToken(event.authorizationToken)
//     logger.info('User was authorized', jwtToken)

//     return {
//       principalId: jwtToken.sub,
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Allow',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   } catch (e) {
//     logger.error('User not authorized', { error: e.message })

//     return {
//       principalId: 'user',
//       policyDocument: {
//         Version: '2012-10-17',
//         Statement: [
//           {
//             Action: 'execute-api:Invoke',
//             Effect: 'Deny',
//             Resource: '*'
//           }
//         ]
//       }
//     }
//   }
// }

// async function verifyToken(authHeader: string): Promise<JwtPayload> {
//   logger.info('Verifying token...')

//   const token = getToken(authHeader)

//   const res = await Axios.get(jwksUrl)

//   const pemData = res['data']['keys'][0]['x5c'][0]
//   const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`

//   return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
// }

// function getToken(authHeader: string): string {
//   if (!authHeader) throw new Error('No authentication header')

//   if (!authHeader.toLowerCase().startsWith('bearer '))
//     throw new Error('Invalid authentication header')

//   const split = authHeader.split(' ')
//   const token = split[1]

//   return token
// }
