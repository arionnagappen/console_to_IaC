import { IAMGroup } from "../constructs/security/iam/iam-group/iam_groups";
import { DeveloperPolicy } from "../constructs/security/iam/group-policies/dev-policies"
import { OperationsPolicy } from "../constructs/security/iam/group-policies/ops-policies";
import { FinancePolicy } from "../constructs/security/iam/group-policies/fin-policies";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

interface IAMStackProps extends cdk.StackProps {}

export class IAMStack extends cdk.Stack{
  constructor(scope: Construct, id: string) {
    super(scope, id)

    // Policies
    const devPolicy = new DeveloperPolicy(this, 'DevPolicy');
    const opsPolicy = new OperationsPolicy(this, 'OperationsPolicy');
    const financePolicy = new FinancePolicy(this, 'FinancePolicy');

    // IAM Groups
    const devGroup = new IAMGroup(this, 'DeveloperGroup', {
      groupName: 'Developer-Group'
    });

    const opsGroup = new IAMGroup(this, 'OperationsGroup', {
      groupName: 'Operations-Group'
    });

    const financeGroup = new IAMGroup(this, 'FinanceGroup', {
      groupName: 'Finance-Group'
    });

    // Attach Policies
    devPolicy.attachToGroup(devGroup.iam_group);
    opsPolicy.attachToGroup(opsGroup.iam_group);
    financePolicy.attachToGroup(financeGroup.iam_group);
  }
}