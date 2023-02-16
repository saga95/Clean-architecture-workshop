#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CleanarcWorkshopStack } from '../lib/cleanarc-workshop-stack';

const app = new cdk.App();
new CleanarcWorkshopStack(app, 'CleanarcWorkshopStack');
