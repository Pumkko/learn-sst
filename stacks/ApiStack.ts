import { Api, Config, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {

    const STRIPE_SECRET_KEY = new Config.Secret(stack, "STRIPE_SECRET_KEY");

    const { table } = use(StorageStack);

    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [table, STRIPE_SECRET_KEY]
            },
            authorizer: "iam"
        },
        routes: {
            "POST /notes": "packages/functions/src/create.handler",
            "GET /notes/{id}": "packages/functions/src/get.handler",
            "GET /notes": "packages/functions/src/list.handler",
            "PUT /notes/{id}": "packages/functions/src/update.handler",
            "DELETE /notes/{id}": "packages/functions/src/delete.handler",
            "POST /billing": "packages/functions/src/billing.handler"
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    }

}