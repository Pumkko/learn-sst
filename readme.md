# What did i learn

## Followed the SST Guide
Followed this guide to learn : https://sst.dev/guide.html
It's honestly awesome, what they did with that guide is really amzing, a full stack app step by step with auth, secrets management...

Copy pasted most of the code about bootstrap because i did not care about that but otherwise i tried to understand I 
- Used Amplify V6 and not V5 as they tell you to use in the guide (`npm install amplify@v5`), took some digging when V6 had a breaking change but nothing crazy.
- Copy pasted the code for Bootstrap and everything but later i'd like to :
    - Use Tanstack Form
    - Use Tanstack router

## SST Guide is guide is great but not up to date
It's great, really, but not up to date like this part : https://sst.dev/chapters/add-an-api-to-create-a-note.html
just does not work with the news SDK V3. I had to change 

- `export async function main(event: APIGatewayProxyEvent)` becomes `export const handler = ApiHandler(async (event) =>`
- the whole part about creating the command 
```
params = {
      TableName: Table.Notes.tableName,
      Item: {
        // The attributes of the item to be created
        userId: "123", // The id of the author
        noteId: uuid.v1(), // A unique uuid
        content: data.content, // Parsed from request body
        attachment: data.attachment, // Parsed from request body
        createdAt: Date.now(), // Current Unix timestamp
      },
```

becomes 
```
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
```

I also had to install a specific lib (aws-sdk/lib-dynamodb) that i found looking at this SO post :
https://stackoverflow.com/questions/66591418/aws-nodejs-sdk-v3-dynamodb-updateitem-typeerror-cannot-read-property-0-of-u

That lib allows to simply use the `PutCommand` object which i could then use simply 
```
    const docClient = DynamoDBDocumentClient.from(dynamoDb);

    try {
        await docClient.send(params);
        return {
            statusCode: 200,
            body: JSON.stringify(params.input.Item)
        }
    }
```
