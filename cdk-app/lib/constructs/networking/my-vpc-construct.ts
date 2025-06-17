import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface MyVpcProps {
  cidr: string;
  cidrMask: number;
  maxAzs?: number;
}

export class MyVPC extends Construct {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: MyVpcProps){
    super(scope, id)

    this.vpc = new ec2.Vpc(this, 'MyVPC', {
      ipAddresses: ec2.IpAddresses.cidr(props.cidr),

      maxAzs: props.maxAzs ?? 2,

      subnetConfiguration: [
        {
          name: 'application-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: props.cidrMask ?? 24,
        },

        {
          name: 'database-subnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: props.cidrMask ?? 24
        }
      ]
    })
  }

}