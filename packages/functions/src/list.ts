import { dynamoDb } from "@notes/core/dynamoDb";
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";


export const handler = errorBoundariesHandler(async () => {
    const response = await dynamoDb.query({
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ":userId": "123"
        },
        TableName: Table.Notes.tableName
    });
    return {
        statusCode: 200,
        body: JSON.stringify(response.Items)
    }
})