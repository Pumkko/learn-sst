import { safeParse } from "valibot";
import { dynamoDb } from "@notes/core/dynamoDb";
import { Table } from "sst/node/table";
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler"
import { UpdateNoteSchema, QueryWithNoteIdSchema } from "@notes/core/ValibotNoteSchema";

export const handler = errorBoundariesHandler(async (event, context) => {

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
            userId: context.identity?.cognitoIdentityId,
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