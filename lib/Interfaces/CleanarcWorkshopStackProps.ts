import { StackProps } from "aws-cdk-lib";

export interface CleanarcWorkshopStackProps extends StackProps {
  readonly appName: string;
  readonly region: string;
}
