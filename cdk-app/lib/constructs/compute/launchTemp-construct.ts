import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ISecurityGroup } from "aws-cdk-lib/aws-ec2";

export interface LaunchTempProps {
  launchTempName: string;
  imageId: string;
  instanceType: string;
  securityGroupId: ISecurityGroup["securityGroupId"];
}

export class MyLaunchTemp extends Construct {
  public readonly launchTemp: ec2.CfnLaunchTemplate

  constructor(scope: Construct, id: string, props: LaunchTempProps) {
    super(scope, id)

    this.launchTemp = new ec2.CfnLaunchTemplate(this, 'AppLaunchTemplate', {
      launchTemplateName: props.launchTempName,
      launchTemplateData: {
        imageId: props.imageId, 
        instanceType: props.instanceType,
        securityGroupIds: [props.securityGroupId],
      }
    });
  };
};