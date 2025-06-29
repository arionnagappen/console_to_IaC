import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';


export class FinancePolicy extends Construct {
  private policy: iam.Policy;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.policy = new iam.Policy(this, 'FinancePolicy', {
      statements: [
        new iam.PolicyStatement({ 
          actions: ['s3:GetObject'], 
          resources: ['*'] 
        })
      ]
    });
  }

  attachToGroup(group: iam.Group) {
    group.attachInlinePolicy(this.policy);
  }
}
