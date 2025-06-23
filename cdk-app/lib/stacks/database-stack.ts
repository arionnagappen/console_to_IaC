import { Construct } from "constructs";
import { DatabaseSecurityGroup } from "../constructs/database/rds-sg-construct";
import { MyRDSInstance } from "../constructs/database/rds-instance-construct"; 
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as cdk from 'aws-cdk-lib';

interface DBStackProps extends cdk.StackProps{
  vpc: ec2.IVpc
  appSecurityGroupId: ec2.ISecurityGroup["securityGroupId"];
}

export class DBStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props: DBStackProps) {
    super(scope, id, props)

    // Security Group
    const dbSecurityGroup = new DatabaseSecurityGroup(this, 'DBSecurityGroup', {
      vpc: props.vpc,
      appSecurityGroupId: props.appSecurityGroupId
    });

    const mySubnetGroup = new rds.SubnetGroup(this, 'MyDbSubnetGroup', {
      description: 'Subnet group for RDS',
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED, 
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // Retrieve Secret
    const dbSecret = secretsmanager.Secret.fromSecretNameV2(this, 'SecretName','rds-credentials');

    // Tell RDS use the Secret
    const myCredentials = rds.Credentials.fromSecret(dbSecret);

    new MyRDSInstance(this, 'MyDatabase', {
      vpc: props.vpc,
      dbSubnetGroup: mySubnetGroup,
      dbName: 'myDatabase',
      dbInstanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      dbStorage: 10,
      dbEngine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_4_5}),
      dbCredentials: myCredentials,
      dbSecurityGroup: [dbSecurityGroup.dbSecurityGroup],
      dbMultiAZ: true,
    })

  }
}