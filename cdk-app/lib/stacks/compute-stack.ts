import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MyLaunchTemp } from '../constructs/compute/launchTemp-construct';
import { MyAutoScalingGroup } from '../constructs/compute/asg-construct';
import { AppSecurityGroup } from '../constructs/compute/launchTemp-SG';
import * as ec2 from 'aws-cdk-lib/aws-ec2'

interface ComputeStackProps extends cdk.StackProps{
  vpc: ec2.IVpc
}

export class ComputeStack extends cdk.Stack {
  public readonly launchTempSg: ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props: ComputeStackProps){
    super(scope, id, props)

    const launchTempSg = new AppSecurityGroup(this, 'AppSG', {
      vpc: props.vpc
    });

    const launchTemp = new MyLaunchTemp(this, 'AsgLaunchTemp', {
      launchTempName: 'AppServerLaunchTemp',
      imageId: 'ami-0914bddde8faa93a0',
      instanceType: 't3.micro',
      securityGroupId: launchTempSg.securityGroup.securityGroupId
    });

    this.launchTempSg = launchTempSg.securityGroup;

    new MyAutoScalingGroup(this, 'AppServerASG', {
      vpc: props.vpc,
      launchTemplate: launchTemp.launchTemp,
      subnetType: ec2.SubnetType.PUBLIC,
      minSize: 1,
      maxSize: 3,
      desiredCapacity: 2,
    });
  };
};