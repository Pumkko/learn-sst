import { safeParse } from "valibot";
import { Table } from "sst/node/table";
import { dynamoDb } from "@notes/core/dynamoDb"
import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";
import { QueryWithNoteIdSchema } from "@notes/core/ValibotNoteSchema";

export const handler = errorBoundariesHandler(async (event, context) => {
    const parseResult = safeParse(QueryWithNoteIdSchema, event.pathParameters);
    if (!parseResult.success) {
        return {
            statusCode: 400,
            body: JSON.stringify(parseResult.issues)
        }
    }

    const response = await dynamoDb.get({
        Key: {
            userId: context.identity?.cognitoIdentityId,
            noteId: parseResult.output.id
        },
        TableName: Table.Notes.tableName
    });
    return {
        statusCode: 200,
        body: JSON.stringify(response.Item)
    }

})