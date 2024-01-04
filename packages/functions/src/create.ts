import { Table } from "sst/node/table";
import { v4 } from "uuid";
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { ApiHandler } from "sst/node/api";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { CreateNoteSchema } from "./ValibotSchema";
import { safeParse } from "valibot";

const dynamoDb = new DynamoDBClient()

export const handler = ApiHandler(async (event) => {

    let params: PutCommand | undefined;

    const jsonBody = JSON.parse(event.body ?? "{}");
    const parseResult = safeParse(CreateNoteSchema, jsonBody);

    if (!parseResult.success) {
        return {
            statusCode: 400,
            body: JSON.stringify(parseResult.issues)
        }
    }

    params = new PutCommand({
        TableName: Table.Notes.tableName,
        Item: {
            content: parseResult.output.content,
            attachment: parseResult.output.attachment,
            userId: "123",
            noteId: v4(),
            createdAt: Date.now()
        }
    })


    const docClient = DynamoDBDocumentClient.from(dynamoDb);

    try {
        await docClient.send(params);
        return {
            statusCode: 200,
            body: JSON.stringify(params.input.Item)
        }
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



