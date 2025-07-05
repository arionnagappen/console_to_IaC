# TechHealth Inc. — Infrastructure as Code Modernization (AWS CDK)

## 🚀 Executive Summary

This project demonstrates how TechHealth Inc. migrated its AWS infrastructure from fragile, manually configured console setups to a modular and testable Infrastructure as Code (IaC) system using AWS CDK (TypeScript). It reflects real-world patterns used in production environments — with scoped tradeoffs made for learning and demonstration purposes.

---

## 🧩 Problem Statement

| Challenge                 | Console-Managed AWS                |
| ------------------------- | ---------------------------------- |
| Inconsistent Environments | Manual setup across dev/stage/prod |
| No Audit or Rollback      | No visibility into changes         |
| No Testing or CI/CD       | Risky, manual deploys              |
| No Modularity or Reuse    | Slows down scaling                 |

---

## 🛠️ Solution Architecture

**Infrastructure as Code using AWS CDK with TypeScript**

* **Modular Constructs**: Security Groups, Launch Templates, Auto Scaling Groups
* **Composable Stacks**: Network, Compute, Database, IAM
* **Version Controlled**: Git with branching + PRs
* **Tested**: Jest unit and snapshot testing for CDK templates
* **CI/CD**: GitHub Actions pipeline for synth, test, deploy

### Cloud Resources:

* **VPC**: Multi-AZ with public/private subnets and IGW
* **EC2**: Auto Scaling in public subnets (demo scope), secured via SG
* **RDS**: Encrypted, private-subnet deployment w/ Secrets Manager
* **IAM**: Role-based access control using least privilege

---

## 🔍 Design Decisions

* **TypeScript CDK**: Native AWS integration, high-level abstraction, strong typing
* **Unit + Snapshot Testing**: Detect config drift and broken contracts before deployment
* **Construct/Stack Separation**: Reusability and domain-driven structure
* **CI/CD over Console**: Auditability, rollback, and safer deploys via GitHub Actions

---

## 💡 Business Impact

| Value Driver       | Before IaC              | After CDK + CI/CD          |
| ------------------ | ----------------------- | -------------------------- |
| Speed to Market    | Manual + slow           | Automated + parallelizable |
| Reliability        | Fragile, error-prone    | Tested, repeatable         |
| Risk Mitigation    | No rollback             | Git history + approvals    |
| Team Collaboration | Single-user bottlenecks | Branch-based workflows     |

---

## 🧪 Development & Testing Workflow

```bash
# Clone and setup
$ git clone <repo-url>
$ cd cdk-app && npm install

# Run unit and snapshot tests
$ npm test

# Synthesize CloudFormation templates
$ npx cdk synth

# Deploy (requires credentials)
$ npx cdk deploy --all
```

---

## 🔄 CI/CD: GitHub Actions Workflow

* **Triggers on PR**
* Runs unit tests and `cdk synth`
* Bootstraps AWS if needed
* Deploys all stacks
* Optional: `cdk destroy` for cleanup

### Secrets & Access

* AWS credentials stored in GitHub Secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)

---

## 🧠 Skills Learned

* This repo reflects my ability to:

  * Build production-grade AWS infra using CDK
  * Design for testability, modularity, and maintainability
  * Set up CI/CD pipelines for safe, auditable deploys
  * Align technical design with business value

---

## 📜 License

MIT
