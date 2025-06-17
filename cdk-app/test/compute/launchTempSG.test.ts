import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { AppSecurityGroup } from '../../lib/constructs/compute/launchTemp-SG';

// Assertion Test
test('App Server Security Group has correct rules', () => {
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Adds a Vpc
  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1,
  });

  new AppSecurityGroup(stack, 'TestSG', {vpc});

  const template = Template.fromStack(stack);

  // Check that only 1 SG is creates
  template.resourceCountIs('AWS::EC2::SecurityGroup', 1);

  // Ingress Rule on Port 80
  template.hasResourceProperties('AWS::EC2::SecurityGroup', {
    SecurityGroupIngress: Match.arrayWith([
      Match.objectLike ({
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
        CidrIp: '0.0.0.0/0',
      })
    ])
  });


  // Egress Rule on Port 80
  template.hasResourceProperties('AWS::EC2::SecurityGroup', {
    SecurityGroupEgress: Match.arrayWith([
      Match.objectLike ({
        IpProtocol: 'tcp',
        FromPort: 80,
        ToPort: 80,
        CidrIp: '0.0.0.0/0',
      })
    ])
  });
});

// Snapshot Test
test('App Security Group matches snapshot', ()=>{
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Adds a Vpc
  const vpc = new ec2.Vpc(stack, 'TestVpc', {maxAzs: 1,});

  new AppSecurityGroup(stack, 'TestSG', {vpc});

  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
});