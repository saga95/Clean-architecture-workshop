import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  EventBridgeClient,
  ActivateEventSourceCommand,
  ActivateEventSourceCommandInput,
  PutEventsCommandInput,
  PutEventsCommand
} from "@aws-sdk/client-eventbridge";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({
  region: "us-west-2",
});

const ebClient = new EventBridgeClient({ region: "REGION" });

exports.handler = async (event: any) => {
  const { MEAL_TYPE, MEAL_PREP, MEAL_SIZE, EMPLOYEE_ID } = JSON.parse(
    event.body
  );

  const tableName = process.env.TABLE_NAME;
  const partitionKey = process.env.PARTITION_KEY;
  const sortKey = process.env.SORT_KEY;
  const notificationEventBus = process.env.NOTIFICATION_EVENT_BUS;

  const date = new Date().toLocaleDateString().replace(/\//g, "-");

  const params: PutItemCommandInput = {
    TableName: process.env.TABLE_NAME,
    Item: {
      [`${partitionKey}`]: { S: `DATE#${date}` },
      [`${sortKey}`]: { S: `MEAL#${randomUUID()}` },
      MEAL_TYPE: { S: MEAL_TYPE },
      MEAL_PREP: { S: MEAL_PREP },
      MEAL_SIZE: { S: MEAL_SIZE },
      GSI1PK: { S: `EMP${EMPLOYEE_ID}` },
    },
  };

  const ebParams: PutEventsCommandInput = {
    Entries: [
      {
        Source: "submitMealLambdaFunction",
        DetailType: "SubmitMealNotification",
        Detail: JSON.stringify({
          EMPLOYEE_ID,
          MEAL_TYPE,
          MEAL_PREP,
          MEAL_SIZE,
        }),
        EventBusName: notificationEventBus,
      },
    ],
  };

  const command = new PutItemCommand(params);
  const ebCommand = new PutEventsCommand(ebParams);

  try {
    await client.send(command);
    await ebClient.send(ebCommand);

    console.log(`Item added successfully to ${tableName}}`);
  } catch (error: any) {
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.log({ requestId, cfId, extendedRequestId });
    console.error(`Error adding item to ${tableName}: ${error}`);
  }
};
