import { errorBoundariesHandler } from "@notes/core/errorBoundariesHandler";
import { safeParse } from "valibot";
import { QueryWithNoteIdSchema } from "./ValibotSchema";
import { dynamoDb } from "@notes/core/dynamoDb";
import { Table } from "sst/node/table";

export const handler = errorBoundariesHandler(async (event, context) => {
    const parseResult = safeParse(QueryWithNoteIdSchema, event.pathParameters);
    if (!parseResult.success) {
        return {
            statusCode: 400,
            body: JSON.stringify(parseResult.issues)
        }
    }

    await dynamoDb.delete({
        TableName: Table.Notes.tableName,
        Key: {
            userId: context.identity?.cognitoIdentityId,
            noteId: parseResult.output.id
        }
    });

    return {
        statusCode: 200
    }
})