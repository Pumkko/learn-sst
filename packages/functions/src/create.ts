import { Table } from "sst/node/table";
import { v4 } from "uuid";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { CreateNoteSchema } from "./ValibotSchema";
import { safeParse } from "valibot";
import { dynamoDb } from "@notes/core/dynamoDb";
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";

export const handler = errorBoundariesHandler(async (event, context) => {


    const jsonBody = JSON.parse(event.body ?? "{}");
    const parseResult = safeParse(CreateNoteSchema, jsonBody);

    if (!parseResult.success) {
        return {
            statusCode: 400,
            body: JSON.stringify(parseResult.issues)
        }
    }



    const params = new PutCommand({
        TableName: Table.Notes.tableName,
        Item: {
            content: parseResult.output.content,
            attachment: parseResult.output.attachment,
            userId: context.identity?.cognitoIdentityId,
            noteId: v4(),
            createdAt: Date.now()
        }
    })

    await dynamoDb.send(params);
    return {
        statusCode: 200,
        body: JSON.stringify(params.input.Item)
    }

});



