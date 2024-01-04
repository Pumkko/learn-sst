import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {

    const { table } = use(StorageStack);

    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [table]
            }
        },
        routes: {
            "POST /notes": "packages/functions/src/create.handler",
            "GET /notes/{id}": "packages/functions/src/get.handler",
            "GET /notes": "packages/functions/src/list.handler",
            "PUT /notes/{id}": "packages/functions/src/update.handler"
        }
    });

    stack.addOutputs({
        ApiEndpoint: api.url
    });

    return {
        api
    }

}