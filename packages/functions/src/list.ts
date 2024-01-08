import { dynamoDb } from "@notes/core/dynamoDb";
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";
import { Table } from "sst/node/table";


export const handler = errorBoundariesHandler(async (_, context) => {
    const response = await dynamoDb.query({
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ":userId": context.identity?.cognitoIdentityId
        },
        TableName: Table.Notes.tableName
    });
    return {
        statusCode: 200,
        body: JSON.stringify(response.Items)
    }
})