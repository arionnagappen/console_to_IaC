import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DatabaseSecurityGroup } from '../../lib/constructs/database/rds-sg-construct';
import { MyRDSInstance } from '../../lib/constructs/database/rds-instance-construct';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'

// Assertion Test
test('Test DB Stack for security properties', () => {
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Adds a Vpc
  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1,
    subnetConfiguration: [{
      name: 'test-subnet',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED
    }]
  });

  const appSG = new ec2.SecurityGroup(stack, 'TestAppSG', {vpc});

  // Security Group
  const dbSG = new DatabaseSecurityGroup(stack, 'TestDbSG', {
    vpc,
    appSecurityGroupId: appSG.securityGroupId
  });

  const mySubnetGroup = new rds.SubnetGroup(stack, 'MyDbSubnetGroup', {
    description: 'Subnet group for RDS',
    vpc: vpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED, 
    },
    removalPolicy: cdk.RemovalPolicy.DESTROY
  });

  // Retrieve Secret
  const dbSecret = secretsmanager.Secret.fromSecretNameV2(stack, 'SecretName','rds-credentials');

  // Tell RDS use the Secret
  const myCredentials = rds.Credentials.fromSecret(dbSecret);

  new MyRDSInstance(stack, 'MyDatabase', {
    vpc: vpc,
    dbSubnetGroup: mySubnetGroup,
    dbName: 'myDatabase',
    dbInstanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    dbStorage: 10,
    dbEngine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_4_5}),
    dbCredentials: myCredentials,
    dbSecurityGroup: [dbSG.dbSecurityGroup],
    dbMultiAZ: true,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::RDS::DBInstance', {
    MasterUsername: Match.anyValue(),
    MasterUserPassword: Match.anyValue(),
    VPCSecurityGroups: Match.anyValue(),
    StorageEncrypted: true
  })

})