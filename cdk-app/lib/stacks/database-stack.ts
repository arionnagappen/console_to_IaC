import { Construct } from "constructs";
import { DatabaseSecurityGroup } from "../constructs/database/rds-sg-construct";
import { MyRDSInstance } from "../constructs/database/rds-instance-construct"; 
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';

interface DBStackProps extends cdk.StackProps{
  vpc: ec2.IVpc
  appSecurityGroup: ec2.ISecurityGroup;
}



export class DBStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props: DBStackProps) {
    super(scope, id, props)

    // Security Group
    const dbSecurityGroup = new DatabaseSecurityGroup(this, 'DBSecurityGroup', {
      vpc: props.vpc,
      appSecurityGroup: props.appSecurityGroup
    });

    const mySubnetGroup = new rds.SubnetGroup(this, 'MyDbSubnetGroup', {
      description: 'Subnet group for RDS',
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED, 
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const myCredentials = rds.Credentials.fromGeneratedSecret('rds-credentials')

    new MyRDSInstance(this, 'MyDatabase', {
      vpc: props.vpc,
      dbSubnetGroup: mySubnetGroup,
      dbName: 'myDatabase',
      dbInstanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      dbStorage: 10,
      dbEngine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_4_5}),
      dbCredentials: myCredentials,
      dbSecurityGroup: [props.appSecurityGroup],
      dbMultiAZ: true,
    })

  }
}