#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkAppStack } from '../lib/cdk-app-stack';
import { NetworkStack } from '../lib/stacks/network-stack';
import { ComputeStack } from '../lib/stacks/compute-stack';

const app = new cdk.App();

const networkStack = new NetworkStack(app, 'NetworkStack', {})

const computeStack = new ComputeStack(app, 'ComputeStack', {
  vpc: networkStack.vpc
})