import { Construct } from "constructs";
import * as iam from 'aws-cdk-lib/aws-iam';

interface GroupProps {
  groupName: string;
  managedPolicies?: iam.IManagedPolicy[];
}

export class IAMGroup extends Construct {
  public readonly iam_group: iam.Group

  constructor(scope: Construct, id: string, props: GroupProps) {
    super(scope, id)

    this.iam_group = new iam.Group(this, 'IamGroup', {
      groupName: props.groupName,
      managedPolicies: props.managedPolicies ?? []
    })
  }
}