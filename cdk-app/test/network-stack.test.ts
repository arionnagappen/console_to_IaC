import { App } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import { NetworkStack } from '../lib/stacks/network-stack'

// Assertion Test
test('VPC is created with correct CIDR', ()=> {
  const app = new App();
  const stack = new NetworkStack(app, 'TestStack');

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::EC2::VPC', {
    CidrBlock: '10.0.0.0/16'
  });
});

// Snapshot Test
test('VPC stack matches snapshot', ()=>{
  const app = new App();
  const stack = new NetworkStack(app, 'TestStack');

  const template = Template.fromStack(stack).toJSON();

  expect(template).toMatchSnapshot();
})
