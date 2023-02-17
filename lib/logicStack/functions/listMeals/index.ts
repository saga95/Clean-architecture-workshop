import {
  DynamoDBClient,
  QueryCommandInput,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-west-2",
});

exports.handler = async (event: any) => {
  const { date } = event.queryStringParameters;

  const tableName = process.env.TABLE_NAME;

  const params: QueryCommandInput = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "pk = :p",
    ExpressionAttributeValues: {
      ":p": { S: `DATE#${date}` },
    },
  };

  const command = new QueryCommand(params);

  try {
    const data = await client.send(command);
    console.log("data: ", data);

    console.log(`Item retrieved successfully from ${tableName}}`);
  } catch (error: any) {
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.log({ requestId, cfId, extendedRequestId });
    console.error(`Error querying item from ${tableName}: ${error}`);
  }
};
