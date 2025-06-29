import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';

export class OperationsPolicy extends Construct {
  private policy: iam.Policy;

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.policy = new iam.Policy(this, 'DevPolicy', {
      statements: [

        // EC2 
        new iam.PolicyStatement({
          actions: ['ec2:*'],
          resources: ['*']
        }),

        new iam.PolicyStatement({
          actions: ['autoscaling:*'],
          resources: ['*']
        }),

        // RDS
        new iam.PolicyStatement({
          actions: [
            'rds:DescribeDBInstances',
            'rds:DescribeDBClusters'
          ],
          resources: ['*']
        }),

        // S3
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: ['*']
        }),

        // IAM
        new iam.PolicyStatement({
          actions: [
            'iam:Get*', 
            'iam:List*'
          ],
          resources: ['*']
        })
      ]
    });
  }

  attachToGroup(group: iam.Group) {
    group.attachInlinePolicy(this.policy);
  }
}