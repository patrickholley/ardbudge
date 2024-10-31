#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ArdStack } from '../lib/ard-stack';

const app = new cdk.App();
new ArdStack(app, 'ArdStack');
