import {
  NestedStack,
  NestedStackProps,
  aws_dynamodb as DynamoDB,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

const settings: any = {
  billingMode: DynamoDB.BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.DESTROY,
  stream: DynamoDB.StreamViewType.NEW_AND_OLD_IMAGES,
};

export class TableNestedStack extends NestedStack {
  public readonly workshopTable: Table;
  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    // Create table for store employee, meal, vendor and user data
    this.workshopTable = new Table(this, "WorkshopTable", {
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      tableName: "workshopTable",
      ...settings,
    });
  }
}
