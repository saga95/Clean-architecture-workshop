import {
  NestedStack,
  NestedStackProps,
  aws_dynamodb as DynamoDB,
  RemovalPolicy,
  aws_events as events,
} from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class EventsNestedStack extends NestedStack {
  public readonly notificationEvent: events.EventBus;
  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    this.notificationEvent = new events.EventBus(
      this,
      "NotificationEventBust",
      {
        eventBusName: "CleanarcWorkshopCDK-NotificationEventBust",
      }
    );
  }
}
