import { Construct } from "constructs";
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface DBSgProps {
  vpc: ec2.IVpc;
  appSecurityGroupId: ec2.ISecurityGroup["securityGroupId"]
}

export class DatabaseSecurityGroup extends Construct {
  public readonly dbSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: DBSgProps){
    super(scope, id)

    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc: props.vpc,
      description: 'RDS Database Security Group',
      allowAllOutbound: false
    })

    // Only allow inbound traffic on port 3306
    this.dbSecurityGroup.addIngressRule(
      ec2.Peer.securityGroupId(props.appSecurityGroupId),
      ec2.Port.tcp(3306)
    )

    // Only allow outbound traffic on port 3306
    this.dbSecurityGroup.addEgressRule(
      ec2.Peer.securityGroupId(props.appSecurityGroupId),
      ec2.Port.tcp(3306)
    )
  }
}