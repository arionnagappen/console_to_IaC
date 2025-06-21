import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as kms from 'aws-cdk-lib/aws-kms';

interface DBProps {
  vpc: ec2.IVpc;
  dbSubnetGroup: rds.SubnetGroup;
  dbName: string;
  dbInstanceType: ec2.InstanceType;
  dbStorage: number;
  dbEngine: rds.IInstanceEngine;
  dbCredentials: rds.Credentials;
  dbSecurityGroup: ec2.ISecurityGroup[];
  dbMultiAZ: boolean;
}

export class MyRDSInstance extends Construct {
  public readonly rdsInstance: rds.DatabaseInstance

  constructor(scope: Construct, id: string, props: DBProps){
    super(scope, id)

    const encryptionKey = new kms.Key(this, 'RdsKmsKey', {
      enableKeyRotation: true,
      alias: 'alias/myRdsKey'
    })


    this.rdsInstance = new rds.DatabaseInstance(this, 'MyRDSInstance', {
      vpc: props.vpc,
      subnetGroup: props.dbSubnetGroup,
      databaseName: props.dbName,
      instanceType: props.dbInstanceType,
      allocatedStorage: props.dbStorage,
      engine: props.dbEngine,

      credentials: props.dbCredentials,
      securityGroups: props.dbSecurityGroup,
      publiclyAccessible: false,
      storageEncrypted: true,
      storageEncryptionKey: encryptionKey,

      deletionProtection: false,
      
      multiAz: props.dbMultiAZ
    })
  }
}