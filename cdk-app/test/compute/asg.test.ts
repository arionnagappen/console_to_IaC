import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { MyLaunchTemp } from '../../lib/constructs/compute/launchTemp-construct';
import { AppSecurityGroup } from '../../lib/constructs/compute/launchTemp-SG';
import { MyAutoScalingGroup } from '../../lib/constructs/compute/asg-construct';

// Assertion Test
test('Check Properties of Auto-Scaling Group', () => {
  const app = new cdk.App();

  const stack = new cdk.Stack(app, 'TestStack');

  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1,
    subnetConfiguration: [{
      name: 'test-subnet',
      subnetType: ec2.SubnetType.PUBLIC
    }]
  });

  const sg = new AppSecurityGroup(stack, 'TestSG', { vpc });

  const launchTemplate = new MyLaunchTemp(stack, 'TestLaunchTemplate', {
    launchTempName: 'TestLaunchTemplate',
    imageId: 'ami-12345678',
    instanceType: 't3.micro',
    securityGroupId: sg.securityGroup.securityGroupId,
  });

  // Create ASG
  new MyAutoScalingGroup(stack, 'TestASG', {
    vpc,
    subnetType: ec2.SubnetType.PUBLIC,
    minSize: 1,
    maxSize: 3,
    desiredCapacity: 2,
    launchTemplate: launchTemplate.launchTemp
  });

  // Assert
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::AutoScaling::AutoScalingGroup', {
    MinSize: '1',
    MaxSize: '3',
    DesiredCapacity: '2'
  });
});

// Snapshot Test
test('ASG Snapshot Test', ()=> {
  const app = new cdk.App();

  const stack = new cdk.Stack(app, 'TestStack');

  const vpc = new ec2.Vpc(stack, 'TestVpc', {
    maxAzs: 1,
    subnetConfiguration: [{
      name: 'test-subnet',
      subnetType: ec2.SubnetType.PUBLIC
    }]
  });

  const sg = new AppSecurityGroup(stack, 'TestSG', { vpc });

  const launchTemplate = new MyLaunchTemp(stack, 'TestLaunchTemplate', {
    launchTempName: 'TestLaunchTemplate',
    imageId: 'ami-12345678',
    instanceType: 't3.micro',
    securityGroupId: sg.securityGroup.securityGroupId,
  });

  // Create ASG
  new MyAutoScalingGroup(stack, 'TestASG', {
    vpc,
    subnetType: ec2.SubnetType.PUBLIC,
    minSize: 1,
    maxSize: 3,
    desiredCapacity: 2,
    launchTemplate: launchTemplate.launchTemp
  });

  // Snapshot
  const template = Template.fromStack(stack).toJSON()
  expect(template).toMatchSnapshot();
})