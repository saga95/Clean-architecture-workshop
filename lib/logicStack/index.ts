import {
  NestedStack,
  aws_lambda as Lambda,
  aws_apigateway as apig,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
import { LogicNestedStackProps } from "../Interfaces/LogicNestedStackProps";

export class LogicNestedStack extends NestedStack {
  public readonly submitMealFunction: Lambda.Function;
  public readonly listMealsFunction: Lambda.Function;
  public readonly sendNotificationFunction: Lambda.Function;

  constructor(scope: Construct, id: string, props?: LogicNestedStackProps) {
    super(scope, id, props);

    this.submitMealFunction = new Lambda.Function(this, "submitMealFunction", {
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset(
        path.join(__dirname, "./functions/submitMeal")
      ),
      handler: "index.handler",
      environment: {
        TABLE_NAME: props?.table.tableName || "Table missing",
        PARTITION_KEY: "pk",
        SORT_KEY: "sk",
        NOTIFICATION_EVENT_BUS: props?.notificationEventBus.eventBusName || "Event bus missing",
      },
    });

    props?.table.grantReadWriteData(this.submitMealFunction);
    props?.apigateway.root.addMethod(
      "POST",
      new apig.LambdaIntegration(this.submitMealFunction)
    );

    this.listMealsFunction = new Lambda.Function(this, "listMealsFunction", {
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset(
        path.join(__dirname, "./functions/listMeals")
      ),
      handler: "index.handler",
      environment: {
        TABLE_NAME: props?.table.tableName || "Table missing",
      },
    });

    props?.table.grantReadWriteData(this.listMealsFunction);
    props?.apigateway.root.addMethod(
      "GET",
      new apig.LambdaIntegration(this.listMealsFunction)
    );

    this.sendNotificationFunction = new Lambda.Function(this, "sendNotificationFunction", {
        runtime: Lambda.Runtime.NODEJS_14_X,
        code: Lambda.Code.fromAsset(
          path.join(__dirname, "./functions/sendNotification")
        ),
        handler: "index.handler",
        environment: {
          TABLE_NAME: props?.table.tableName || "Table missing",
        },
      });  
  
  }
}
