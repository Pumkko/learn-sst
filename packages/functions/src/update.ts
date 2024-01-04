import { ApiHandler } from "sst/node/api";
import { safeParse } from "valibot";
import { QueryWithNoteIdSchema, UpdateNoteSchema } from "./ValibotSchema";
import { dynamoDb } from "@notes/core/dynamoDb";
import { Table } from "sst/node/table";
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler"

export const handler = errorBoundariesHandler(async (event) => {

    const jsonBody = JSON.parse(event.body ?? "{}");

    const parseUpdateNoteInput = safeParse(UpdateNoteSchema, jsonBody);
    if(!parseUpdateNoteInput.success){
        return {
            statusCode: 400,
            body: JSON.stringify(parseUpdateNoteInput.issues)
        }
    }

    const parseQueryResult = safeParse(QueryWithNoteIdSchema, event.pathParameters);
    if(!parseQueryResult.success){
        return {
            statusCode: 400,
            body: JSON.stringify(parseQueryResult.issues)
        }
    }

    const updateData = parseUpdateNoteInput.output;

    await dynamoDb.update({
        TableName: Table.Notes.tableName,
        Key: {
            userId: "123",
            noteId: parseQueryResult.output.id
        },
        UpdateExpression: 'SET content = :content, attachment = :attachment',
        ExpressionAttributeValues: {
            ":attachment": updateData.attachment,
            ":content": updateData.content
        },
        ReturnValues: 'ALL_NEW'
    });

    return {
        statusCode: 200
    }

})