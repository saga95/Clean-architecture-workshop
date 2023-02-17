import { NestedStackProps, aws_dynamodb, aws_apigateway as apig, aws_events } from "aws-cdk-lib";

export interface LogicNestedStackProps extends NestedStackProps {
  readonly table: aws_dynamodb.ITable
  readonly apigateway: apig.RestApi
  readonly notificationEventBus: aws_events.EventBus
}
