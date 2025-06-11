import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MyVPC } from '../constructs/networking/my-vpc-construct';

export class NetworkStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);

    const myVpc = new MyVPC(this, 'MyVpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2
    });

    new cdk.CfnOutput(this, 'VpcId', {
      value: myVpc.vpc.vpcId,
      description: 'VPC ID'
    });
  }
}