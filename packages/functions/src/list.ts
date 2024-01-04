import { dynamoDb } from "@notes/core/dynamoDb";
import { ApiHandler } from "sst/node/api";
import { Table } from "sst/node/table";
import { parseResult } from "valibot";

export const handler = ApiHandler(async (event) => {
    try {
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
    } catch (error: unknown) {
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


})