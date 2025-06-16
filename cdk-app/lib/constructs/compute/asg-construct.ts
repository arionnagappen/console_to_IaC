import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { MyLaunchTemp } from './launchTemp-construct';
import { CfnAutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { ISubnet } from 'aws-cdk-lib/aws-ec2';

export interface AsgProps {
  vpc: ec2.IVpc;
  launchTemplate: ec2.CfnLaunchTemplate;
  subnetType?: ec2.SubnetType;
  minSize?: number;
  maxSize?: number;
  desiredCapacity?: number;
}

export class MyAutoScalingGroup extends Construct {
  public readonly asg: CfnAutoScalingGroup;

  constructor(scope: Construct, id: string, props: AsgProps) {
    super(scope, id);

    const subnets = props.vpc.selectSubnets({
      subnetType: props.subnetType?? ec2.SubnetType.PUBLIC
    })

    this.asg = new CfnAutoScalingGroup(this, 'AppServerASG', {
      minSize: `${props.minSize ?? 1}`,
      maxSize: `${props.maxSize ?? 3}`,
      desiredCapacity: `${props.desiredCapacity ?? 2}`,
      vpcZoneIdentifier: subnets.subnetIds,
      launchTemplate: {
        launchTemplateId: props.launchTemplate.ref,
        version: props.launchTemplate.attrLatestVersionNumber
      }
    });
  }
}