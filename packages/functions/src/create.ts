import { Table } from "sst/node/table";
import { v4 } from "uuid";
import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb'
import { ApiHandler } from "sst/node/api";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamoDb = new DynamoDBClient ()

export const handler = ApiHandler(async (event) => {
    let data;
    let params: PutCommand | undefined;

    if (event.body) {
        data = JSON.parse(event.body);
        params = new PutCommand({
            TableName: Table.Notes.tableName,
            Item: {
                content: data.content,
                attachment: data.attachment,
                userId: "123",
                noteId: v4(),
                createdAt: Date.now()
            }
        })
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ errors: true })
        }
    }

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



