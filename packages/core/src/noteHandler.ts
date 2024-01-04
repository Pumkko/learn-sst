import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { ApiHandler } from "sst/node/api";


export const errorBoundariesHandler = (lambda: ReturnType<typeof ApiHandler>) => {
    const handler = ApiHandler(async (event, context) => {
        try {
            return await lambda(event, context);
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