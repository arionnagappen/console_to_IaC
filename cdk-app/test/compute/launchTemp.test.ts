import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { MyLaunchTemp } from '../../lib/constructs/compute/launchTemp-construct';
import { AppSecurityGroup } from '../../lib/constructs/compute/launchTemp-SG';

// Assertion Tests
test('Check Launch Template Properties', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  const dummySgId = 'sg-1234567890';

  new MyLaunchTemp(stack,  'TestLaunchTemp', {
    launchTempName: 'TestTemplate',
    imageId: 'ami-0123456789abcdef0',
    instanceType: 't3.micro',
    securityGroupId: dummySgId
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::LaunchTemplate', {
    LaunchTemplateName: 'TestTemplate',
    LaunchTemplateData: {
      ImageId: 'ami-0123456789abcdef0',
      InstanceType: 't3.micro',
      SecurityGroupIds: [dummySgId],
    },    
  });
});

// Snapshot Test
test('Launch Template matches snapshot', ()=>{
  // Instantiates the App Construct
  const app = new cdk.App();

  // Instantiates the Stack Construct & uses the App Construct as a parameter
  const stack = new cdk.Stack(app, 'TestStack');

  // Instantiate a VPC
  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1
  })

  const launchTempSg = new AppSecurityGroup(stack, 'TestSg', {vpc})

  new MyLaunchTemp(stack, 'TestLaunchTemplate', {
    launchTempName: 'TestTemplate',
    imageId: 'ami-123456789',
    instanceType: 't3.micro',
    securityGroupId: launchTempSg.securityGroup.securityGroupId
  });

  const template = Template.fromStack(stack).toJSON();
  expect(template).toMatchSnapshot();
});