import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface SgProps {
  vpc: ec2.IVpc
}

export class AppSecurityGroup extends Construct {
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SgProps) {
    super(scope, id);

    this.securityGroup = new ec2.SecurityGroup(this, 'AppServerSG', {
      vpc: props.vpc,
      description: 'App Server Security Group',  
      allowAllOutbound: false
    });

    
    // Only allow inbound traffic on port 80
    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80)
    )

    // Only allow outbound traffic on port 80
    this.securityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
    )

  }
}