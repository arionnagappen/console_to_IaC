import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';

export class DeveloperPolicy extends Construct {
  private policy: iam.Policy;

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.policy = new iam.Policy(this, 'DevPolicy', {
      statements: [

        // EC2 
        new iam.PolicyStatement({
          actions: ['ec2:DescribeInstances'],
          resources: ['*']
        }),

        // RDS
        new iam.PolicyStatement({
          actions: ['rds:DescribeInstances'],
          resources: ['*']
        }),

        new iam.PolicyStatement({
          actions: ['secretsmanager:GetSecretValue'],
          resources: ['*']
        }),

        // S3
        new iam.PolicyStatement({
          actions: [
            's3:ListBucket', 
            's3:GetObject', 
            's3:PutObject'
          ],
          resources: ['*']
        }),
      ]
    })
  }

  attachToGroup(group: iam.Group) {
    group.attachInlinePolicy(this.policy);
  }
}