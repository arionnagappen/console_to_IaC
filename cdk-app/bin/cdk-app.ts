#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkAppStack } from '../lib/cdk-app-stack';
import { NetworkStack } from '../lib/stacks/network-stack';

const app = new cdk.App();

new NetworkStack(app, 'NetworkStack', {})