# Security Policy

## Supported Versions

PingPanda maintains security updates for the following versions:

| Version | Supported          | Notes |
| ------- | ------------------ | ----- |
| 5.1.x   | :white_check_mark: | Current stable release with full security support |
| 5.0.x   | :x:               | End of support reached |
| 4.0.x   | :white_check_mark: | Extended support release (ESR) |
| < 4.0   | :x:               | Legacy versions - no longer maintained |

## Reporting a Vulnerability

We take the security of PingPanda seriously. If you believe you have found a security vulnerability, please follow these steps:

1. **DO NOT** disclose the vulnerability publicly until it has been addressed by our team.
2. Email your findings to security@pingpanda.dev (include "SECURITY" in the subject line).
3. Provide detailed information about the vulnerability:
   - Description of the issue
   - Steps to reproduce
   - Affected versions
   - Potential impact
   - Any suggested fixes (if available)

### What to Expect

- **Initial Response**: Within 48 hours, you will receive an acknowledgment of your report.
- **Status Updates**: We will provide updates every 5 business days about the progress.
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 15 days of verification.

### Security Bug Bounty Program

We maintain a bug bounty program to reward security researchers who help improve our security. Rewards are based on:

- Severity of the vulnerability
- Quality of the report
- Potential impact on users

Contact our security team for more details about the bounty program.

## Security Best Practices

### For Users
- Always use the latest stable version
- Enable two-factor authentication when available
- Regularly rotate API keys
- Monitor system logs for suspicious activities

### For Contributors
- Follow secure coding guidelines
- Run security scans before submitting PRs
- Keep dependencies updated
- Sign all commits with GPG

## Supported Security Features

- Two-factor authentication
- API key authentication
- Role-based access control
- Audit logging
- IP whitelisting
- SSO integration (Enterprise)

## Contact

For general security inquiries:
- Email: security@pingpanda.dev
- Security Discord channel: #security-pingpanda
- PGP Key: [security-pgp.asc](https://pingpanda.dev/security-pgp.asc)
