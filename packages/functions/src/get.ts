import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ApiHandler } from "sst/node/api";
import { safeParse } from "valibot";
import { GetNoteSchema } from "./ValibotSchema";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Table } from "sst/node/table";
import { dynamoDb } from "@notes/core/dynamoDb"

export const handler = ApiHandler(async (event) => {

    const parseResult = safeParse(GetNoteSchema, event.pathParameters);

    if (!parseResult.success) {
        return {
            statusCode: 400,
            body: JSON.stringify(parseResult.issues)
        }
    }

    try {
        const response = await dynamoDb.get({
            Key: {
                userId: '123',
                noteId: parseResult.output.id
            },
            TableName: Table.Notes.tableName
        });
        return {
            statusCode: 200,
            body: JSON.stringify(response.Item)
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