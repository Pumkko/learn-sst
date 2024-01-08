import { APIGatewayProxyEventV2, APIGatewayProxyEventV2WithIAMAuthorizer, APIGatewayProxyStructuredResultV2, CognitoIdentity } from "aws-lambda";
import { ApiHandler } from "sst/node/api";

/**
 * I'll ask question on SST's github about that
 */
function weirdIHaveToDoThatSetContext(event: APIGatewayProxyEventV2): CognitoIdentity | undefined {
    const trustMeBro = event as APIGatewayProxyEventV2WithIAMAuthorizer
    const cognitoIdentityTrustMeBro = trustMeBro.requestContext.authorizer.iam.cognitoIdentity as unknown as {
        identityId: string;
        identityPoolId: string
    } | null;


    if(cognitoIdentityTrustMeBro === null){
        return;
    }

    return {
        cognitoIdentityId: cognitoIdentityTrustMeBro.identityId,
        cognitoIdentityPoolId: cognitoIdentityTrustMeBro.identityPoolId
    }
}

export const errorBoundariesHandler = (lambda: ReturnType<typeof ApiHandler>) => {
    const handler = ApiHandler(async (event, context) => {
        const cognitoIdentity = weirdIHaveToDoThatSetContext(event);
        context.identity = cognitoIdentity;
        try {
            const result = await lambda(event, context);
            return result;
        }
        catch (error: unknown) {
            let message;
            if (error instanceof Error) {
                message = error.message;
            } else {
                message = String(error);
            }
            return {
                statusCode: 500,
                body: JSON.stringify({ error: message }),
            };
        }

    });
    return handler;
}