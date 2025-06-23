import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DatabaseSecurityGroup } from '../../lib/constructs/database/rds-sg-construct';

// Assertion Test
test('Test DB Security group for  correct rules', ()=>{
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Adds a Vpc
  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1,
  });

  const appSG = new ec2.SecurityGroup(stack, 'TestSG', {vpc});

  new DatabaseSecurityGroup(stack, 'DbSGTest', {
    vpc: vpc, 
    appSecurityGroupId: appSG.securityGroupId
  })

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::SecurityGroup', {

    GroupDescription: 'RDS Database Security Group',

    // Ingress Rule on Port 3306
    SecurityGroupIngress: Match.arrayWith([
      Match.objectLike ({
        IpProtocol: 'tcp',
        FromPort: 3306,
        ToPort: 3306,
        SourceSecurityGroupId: Match.anyValue()
      })
    ]),

    // Egress Rule on Port 3306
    SecurityGroupEgress: Match.arrayWith([
      Match.objectLike ({
        IpProtocol: 'tcp',
        FromPort: 3306,
        ToPort: 3306,
        DestinationSecurityGroupId: Match.anyValue()
      })
    ])
  });
});

// Snapshot Test
test('Database Security Group matches snapshot', ()=>{
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Adds a Vpc
  const vpc = new ec2.Vpc(stack, 'TestVpc', {maxAzs: 1,});

  const appSG = new ec2.SecurityGroup(stack, 'TestSG', {vpc});

  new DatabaseSecurityGroup(stack, 'DbSGTest', {
    vpc: vpc, 
    appSecurityGroupId: appSG.securityGroupId
  })

  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
});