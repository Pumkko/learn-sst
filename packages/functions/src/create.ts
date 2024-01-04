import { Table } from "sst/node/table";
import { v4 } from "uuid";
import { ApiHandler } from "sst/node/api";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { CreateNoteSchema } from "./ValibotSchema";
import { safeParse } from "valibot";
import { dynamoDb } from "@notes/core/dynamoDb";

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

    try {
        await dynamoDb.send(params);
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



