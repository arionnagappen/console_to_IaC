#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/stacks/network-stack';
import { ComputeStack } from '../lib/stacks/compute-stack';
import { DBStack } from '../lib/stacks/database-stack';
import { IAMStack } from '../lib/stacks/security-stack';

const app = new cdk.App();

const networkStack = new NetworkStack(app, 'NetworkStack', {});

const computeStack = new ComputeStack(app, 'ComputeStack', {
  vpc: networkStack.vpc
});

const dBStack = new DBStack(app, 'DatabaseStack', {
  vpc: networkStack.vpc,
  appSecurityGroupId: computeStack.launchTempSg.securityGroupId
});

const iamStack = new IAMStack(app, 'IAMStack');