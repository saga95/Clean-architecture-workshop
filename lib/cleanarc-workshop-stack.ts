import {
  Stack,
  aws_iam as IAM,
  aws_apigateway as apig,
  aws_events as events,
  aws_events_targets as targets,
  // aws_appsync as appsync,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { EventsNestedStack } from "./eventsStack";
import { CleanarcWorkshopStackProps } from "./Interfaces/CleanarcWorkshopStackProps";
import { LogicNestedStack } from "./logicStack";
import { TableNestedStack } from "./tableStack";

export class CleanarcWorkshopStack extends Stack {
  readonly apigateway: apig.RestApi;
  constructor(
    scope: Construct,
    id: string,
    props?: CleanarcWorkshopStackProps
  ) {
    super(scope, id, props);

    // Rest API endpoint
    this.apigateway = new apig.RestApi(
      this,
      `cleanArcWorkshopAPIGateway-${props?.appName}`,
      {
        restApiName: `cleanArcWorkshopAPIGateway-${props?.appName}`,
        description:
          "This service is used to search the data in the DynamoDB tables",
        defaultCorsPreflightOptions: {
          allowOrigins: apig.Cors.ALL_ORIGINS,
          allowMethods: apig.Cors.ALL_METHODS,
        },
      }
    );

    // Nested stack for events
    const eventsStack = new EventsNestedStack(this, `EventsNestedStack-${props?.appName}`)
    const notificationEventBus = eventsStack.notificationEvent

    // Nested stack for tables
    const tableNestedStack = new TableNestedStack(
      this,
      `TableNedtedStack-${props?.appName}`
    );
    const workshop = tableNestedStack.workshopTable;

    // Nested stack for lambda
    const logicStack = new LogicNestedStack(this, `LogicNestedStack-${props?.appName}`, {
      table: workshop,
      apigateway: this.apigateway,
      notificationEventBus: notificationEventBus
    })
    const sendNotificationLambda = logicStack.sendNotificationFunction

    new events.Rule(this, `NotificationEventRule-${props?.appName}`, {
      eventBus: notificationEventBus,
      eventPattern: {
        source: ["submitMealLambdaFunction"],
        detailType: ["SubmitMealNotification"],
      },
      targets: [
        new targets.LambdaFunction(sendNotificationLambda)
      ]
    })

  }
}
