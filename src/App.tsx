import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import Layout from './components/Layout'
import MarkdownContent from './components/MarkdownContent'
import { extractHeadings } from './components/TableOfContents'

// Content for documentation pages
const CONTENT = {
  intro: `
# Introduction

Welcome to the **Cyrion AI** documentation. Cyrion is an autonomous security testing platform powered by advanced AI agents that can perform end-to-end penetration testing on Web, Mobile, and Cloud environments.

## What is Cyrion?

Cyrion represents the next generation of security tooling. Unlike traditional scanners that follow rigid patterns, Cyrion utilizes Large Language Models (LLMs) to understand context, chain vulnerabilities, and perform complex reasoning like a human security researcher.

### Key Benefits

- **Autonomous Exploration**: Agents discover and test attack surfaces without manual intervention.
- **Multi-Platform**: Support for Web apps, Android (APK/AAB), iOS (IPA), and Cloud infrastructure.
- **Context-Aware**: Understands business logic, authentication flows, and state management.
- **Evidence-Based**: Generates detailed Proof of Concepts (PoCs) and remediation steps.

## How it Works

Cyrion agents operate within a secure, isolated sandbox environment (Docker). They utilize a specialized tool server to execute commands, browse the web, and analyze binaries.

### The Agent Loop

1. **Observation**: The agent observes the current state of the target
2. **Reasoning**: Using chain-of-thought, the agent decides what to do next
3. **Action**: The agent executes tools and commands
4. **Analysis**: Results are analyzed and fed back into the loop

---

> **Note**: Cyrion is designed for professional security researchers and authorized testing only. Always ensure you have explicit permission before testing any target.
`,
  quickstart: `
# Quickstart

Get up and running with your first autonomous security scan in minutes.

## Prerequisites

Before you begin, ensure you have:
- A Cyrion account (sign up at [app.cyrion.ai](https://app.cyrion.ai))
- API keys for your preferred LLM provider
- A target with explicit permission to test

## 1. Create an Account

Sign up at [app.cyrion.ai](https://app.cyrion.ai) and verify your email.

## 2. Configure Your Environment

Go to **Settings** and add your API keys for your preferred LLM provider (OpenRouter, OpenAI, or Anthropic).

### Recommended Models

| Provider | Model | Best For |
|----------|-------|----------|
| Anthropic | Claude 3.5 Sonnet | General testing |
| OpenAI | GPT-4o | Complex reasoning |
| OpenRouter | Various | Cost optimization |

## 3. Start a Scan

1. Click **"New Scan"** from the Dashboard.
2. Enter your target URL or upload a Mobile App (APK/IPA).
3. Define your **Rules of Engagement** (Scope, Out-of-scope).
4. Click **"Start Autonomous Scan"**.

## 4. Monitor Activity

Watch the **Activity Feed** to see agent reasoning and tool executions in real-time.

## 5. Review Findings

As vulnerabilities are discovered, they will appear in the **Vulnerabilities** tab with severity ratings and PoCs.
`,
  architecture: `
# Architecture

Cyrion is built with a distributed, scalable architecture designed for isolation and security.

## System Overview

Cyrion utilizes a multi-layered approach to ensure security and performance:

### 1. API Server (FastAPI)

The central nervous system, handling authentication, scan orchestration, and data persistence.

### 2. Sandbox Runtime

Utilizes Docker to create isolated environments for each user. All agent activity happens within these containers.

### 3. AI Agents

The "brains" of the platform. Agents use a combination of chain-of-thought reasoning and tool use to achieve security objectives.

### 4. Tool Server

A specialized service running inside the sandbox that provides agents with access to:
- Headless Browsers (Playwright)
- Terminal Execution
- Reverse Engineering Tools (Jadx, Radare2)
- Network Proxies (Caido/Mitmproxy)

## Data Flow

\`\`\`
User -> API Server -> Sandbox -> Tool Server -> Target
                  ↓
              Database
\`\`\`

## Security Model

All sandboxes are:
- **Isolated**: No cross-container communication
- **Ephemeral**: Destroyed after scan completion
- **Rate-limited**: Prevent resource abuse
`,
  scans: `
# Autonomous Scans

Scans are the primary unit of work in Cyrion. A scan represents a security assessment against a specific target.

## Configuration

When creating a scan, you can configure several parameters:

### Targets

You can provide URLs, IP addresses, or upload mobile application files (APK/IPA).

### Rules of Engagement (RoE)

Strict guidelines that the AI agent MUST follow. This includes:
- **In-Scope**: Specific domains, endpoints, or network ranges.
- **Out-of-Scope**: Critical infrastructure or third-party services to avoid.
- **Testing Windows**: Time ranges when testing is permitted.

### Max Iterations

Controls how many reasoning loops the agent can perform. Default is 200.

## Scan Lifecycle

1. **Pending**: Initial state after creation.
2. **Running**: The sandbox is initialized and agents are active.
3. **Paused**: Execution is temporarily halted.
4. **Completed**: The agent has reached its goal or max iterations.
5. **Failed**: A critical error occurred during execution.

## Best Practices

- Start with a smaller scope and expand gradually
- Monitor the first few scans closely
- Set appropriate rate limits for production systems
`,
  agents: `
# AI Agents

Cyrion agents are powered by specialized system prompts and large language models.

## Chain of Thought

Agents don't just run tools; they reason about the results.
1. **Thought**: The agent analyzes the current state and findings.
2. **Action**: Selects a tool and provides arguments.
3. **Observation**: Processes the output of the tool.
4. **Conclusion**: Updates its internal model of the target.

## Agent Types

### Web Security Agent
Specialized for web application testing including:
- Authentication bypass
- Injection vulnerabilities
- Business logic flaws

### Mobile Security Agent
Focused on mobile application security:
- Static analysis
- Dynamic instrumentation
- API security

## Pre-installed Tools

The sandbox environment comes pre-loaded with hundreds of security tools:
- **Web**: Nuclei, SQLMap, FFUF, Dirsearch, Katana
- **Mobile**: Jadx, Apktool, Frida, Objection
- **Secret Scanning**: TruffleHog, Gitleaks
`,
  mobile: `
# Mobile Security

Cyrion provides dedicated support for Android and iOS security assessments.

## Android Assessment

- **Static Analysis**: Automated decompilation with Jadx and Apktool.
- **Manifest Review**: Identification of dangerous permissions and exported components.
- **Secret Discovery**: Searching for hardcoded API keys and credentials.

### Supported File Types
- APK (Android Package)
- AAB (Android App Bundle)

## iOS Assessment

- **Binary Analysis**: Mach-O binary inspection with Radare2.
- **Plist Analysis**: Reviewing Info.plist for insecure configurations.
- **URL Scheme Testing**: Identifying custom URL scheme vulnerabilities.

### Supported File Types
- IPA (iOS App Store Package)

## How to Test Mobile Apps

Simply upload your \`.apk\`, \`.aab\`, or \`.ipa\` file when starting a new scan. Cyrion will automatically provision a sandbox with the mobile testing toolchain.

## Common Findings

- Hardcoded API keys and secrets
- Insecure data storage
- Weak cryptography
- Certificate pinning bypass opportunities
`,
  // API Reference pages
  apiOverview: `
# API Reference

The Cyrion API enables you to programmatically manage security scans, retrieve vulnerabilities, and integrate with your existing workflows.

## Base URL

All API requests should be made to:

\`\`\`
https://app.cyrion.ai/api
\`\`\`

## Authentication

All API requests require authentication using a Bearer token in the header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
     -H "Content-Type: application/json" \\
     https://app.cyrion.ai/api/scans
\`\`\`

## Rate Limits

| Plan | Requests/min | Concurrent Scans |
|------|-------------|------------------|
| Free | 60 | 1 |
| Pro | 300 | 5 |
| Enterprise | Unlimited | Unlimited |

## Response Format

All responses are returned in JSON format with consistent structure:

\`\`\`json
{
  "data": { ... },
  "message": "Success"
}
\`\`\`

## Error Responses

Errors return appropriate HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 422 | Validation Error - Invalid request body |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Response Format

\`\`\`json
{
  "detail": "Error message describing the issue"
}
\`\`\`

## Pagination

List endpoints support pagination with the following query parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| skip | integer | 0 | Number of items to skip |
| limit | integer | 100 | Maximum items to return (max: 100) |
`,
  apiAuth: `
# Authentication

Secure your API requests with proper authentication.

## OAuth 2.0 / Bearer Tokens

The Cyrion API uses Bearer token authentication. Include your access token in the Authorization header:

\`\`\`bash
curl -X GET "https://app.cyrion.ai/api/users/me" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json"
\`\`\`

## Getting an Access Token

### Login Endpoint

\`\`\`bash
POST /api/auth/login
\`\`\`

#### Request Body

\`\`\`json
{
  "email": "user@example.com",
  "password": "your_password"
}
\`\`\`

#### Response

\`\`\`json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
\`\`\`

## User Registration

### Register New User

\`\`\`bash
POST /api/auth/register
\`\`\`

#### Request Body

\`\`\`json
{
  "email": "newuser@example.com",
  "password": "secure_password",
  "full_name": "John Doe"
}
\`\`\`

#### Response

\`\`\`json
{
  "id": "user_abc123",
  "email": "newuser@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2025-01-06T10:00:00Z"
}
\`\`\`

## Get Current User

Retrieve information about the authenticated user.

\`\`\`bash
GET /api/users/me
\`\`\`

#### Response

\`\`\`json
{
  "id": "user_abc123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2025-01-06T10:00:00Z"
}
\`\`\`

## Security Best Practices

- **Never expose tokens** in client-side code or URLs
- **Store tokens securely** using environment variables
- **Rotate tokens** regularly for enhanced security
- **Use HTTPS** for all API communications
`,
  apiScans: `
# Scans API

Create, manage, and monitor autonomous security scans.

## Create a Scan

Start a new autonomous security scan against a target.

\`\`\`bash
POST /api/scans
\`\`\`

### Request Body

\`\`\`json
{
  "name": "Production Web App Scan",
  "target_url": "https://example.com",
  "scan_type": "web",
  "project_id": "proj_abc123",
  "rules_of_engagement": {
    "in_scope": ["*.example.com", "api.example.com"],
    "out_of_scope": ["admin.example.com", "*.third-party.com"],
    "max_depth": 5,
    "respect_robots_txt": true
  },
  "agent_config": {
    "model": "claude-3-5-sonnet",
    "max_iterations": 200,
    "temperature": 0.7
  }
}
\`\`\`

### Scan Types

| Type | Description |
|------|-------------|
| web | Web application security testing |
| mobile | Mobile app (APK/IPA) analysis |
| api | REST/GraphQL API testing |
| cloud | Cloud infrastructure assessment |

### Response

\`\`\`json
{
  "id": "scan_xyz789",
  "name": "Production Web App Scan",
  "status": "pending",
  "target_url": "https://example.com",
  "scan_type": "web",
  "project_id": "proj_abc123",
  "created_at": "2025-01-06T10:00:00Z",
  "started_at": null,
  "completed_at": null,
  "vulnerability_count": 0
}
\`\`\`

## List Scans

Retrieve all scans for your account.

\`\`\`bash
GET /api/scans
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| project_id | string | Filter by project |
| status | string | Filter by status (pending, running, completed, failed, stopped) |
| scan_type | string | Filter by scan type |
| skip | integer | Pagination offset |
| limit | integer | Results per page (max 100) |

### Response

\`\`\`json
{
  "data": [
    {
      "id": "scan_xyz789",
      "name": "Production Web App Scan",
      "status": "completed",
      "target_url": "https://example.com",
      "scan_type": "web",
      "vulnerability_count": 12,
      "created_at": "2025-01-06T10:00:00Z",
      "completed_at": "2025-01-06T14:30:00Z"
    }
  ],
  "total": 25,
  "skip": 0,
  "limit": 100
}
\`\`\`

## Get Scan Details

Retrieve detailed information about a specific scan.

\`\`\`bash
GET /api/scans/{scan_id}
\`\`\`

### Response

\`\`\`json
{
  "id": "scan_xyz789",
  "name": "Production Web App Scan",
  "status": "completed",
  "target_url": "https://example.com",
  "scan_type": "web",
  "project_id": "proj_abc123",
  "rules_of_engagement": {
    "in_scope": ["*.example.com"],
    "out_of_scope": ["admin.example.com"]
  },
  "agent_config": {
    "model": "claude-3-5-sonnet",
    "max_iterations": 200
  },
  "statistics": {
    "total_requests": 1547,
    "unique_endpoints": 89,
    "vulnerabilities_found": 12,
    "iterations_used": 156
  },
  "created_at": "2025-01-06T10:00:00Z",
  "started_at": "2025-01-06T10:01:00Z",
  "completed_at": "2025-01-06T14:30:00Z"
}
\`\`\`

## Start a Scan

Begin execution of a pending scan.

\`\`\`bash
POST /api/scans/{scan_id}/start
\`\`\`

## Stop a Scan

Stop a running scan.

\`\`\`bash
POST /api/scans/{scan_id}/stop
\`\`\`

## Pause a Scan

Temporarily pause a running scan.

\`\`\`bash
POST /api/scans/{scan_id}/pause
\`\`\`

## Resume a Scan

Resume a paused scan.

\`\`\`bash
POST /api/scans/{scan_id}/resume
\`\`\`

## Delete a Scan

Delete a scan and all associated data.

\`\`\`bash
DELETE /api/scans/{scan_id}
\`\`\`

## Get Scan Activity

Retrieve the agent activity log for a scan.

\`\`\`bash
GET /api/scans/{scan_id}/activity
\`\`\`

### Response

\`\`\`json
{
  "data": [
    {
      "id": "act_001",
      "timestamp": "2025-01-06T10:05:00Z",
      "type": "thought",
      "content": "Analyzing the login form for potential SQL injection..."
    },
    {
      "id": "act_002",
      "timestamp": "2025-01-06T10:05:30Z",
      "type": "action",
      "tool": "http_request",
      "content": "Testing payload: ' OR '1'='1"
    },
    {
      "id": "act_003",
      "timestamp": "2025-01-06T10:05:35Z",
      "type": "observation",
      "content": "Server returned 500 error with SQL syntax in response"
    }
  ]
}
\`\`\`

## Upload Mobile App

Upload a mobile application file for analysis.

\`\`\`bash
POST /api/scans/upload
Content-Type: multipart/form-data
\`\`\`

### Form Fields

| Field | Type | Description |
|-------|------|-------------|
| file | file | APK, AAB, or IPA file |
| project_id | string | Target project ID |
| name | string | Scan name |

### Response

\`\`\`json
{
  "id": "scan_mobile123",
  "name": "Mobile App Analysis",
  "status": "pending",
  "scan_type": "mobile",
  "file_info": {
    "filename": "app-release.apk",
    "size": 15728640,
    "package_name": "com.example.app"
  }
}
\`\`\`
`,
  apiVulnerabilities: `
# Vulnerabilities API

Retrieve, manage, and export discovered vulnerabilities.

## List Vulnerabilities

Get all vulnerabilities across your scans.

\`\`\`bash
GET /api/vulnerabilities
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| scan_id | string | Filter by scan |
| project_id | string | Filter by project |
| severity | string | Filter by severity (critical, high, medium, low, info) |
| status | string | Filter by status (open, confirmed, false_positive, resolved) |
| skip | integer | Pagination offset |
| limit | integer | Results per page |

### Response

\`\`\`json
{
  "data": [
    {
      "id": "vuln_001",
      "title": "SQL Injection in Login Form",
      "severity": "critical",
      "status": "open",
      "cvss_score": 9.8,
      "scan_id": "scan_xyz789",
      "endpoint": "/api/login",
      "method": "POST",
      "parameter": "username",
      "discovered_at": "2025-01-06T12:30:00Z"
    },
    {
      "id": "vuln_002",
      "title": "Cross-Site Scripting (XSS)",
      "severity": "high",
      "status": "open",
      "cvss_score": 7.5,
      "scan_id": "scan_xyz789",
      "endpoint": "/search",
      "method": "GET",
      "parameter": "q",
      "discovered_at": "2025-01-06T12:45:00Z"
    }
  ],
  "total": 12,
  "skip": 0,
  "limit": 100
}
\`\`\`

## Get Vulnerability Details

Retrieve complete details for a specific vulnerability.

\`\`\`bash
GET /api/vulnerabilities/{vulnerability_id}
\`\`\`

### Response

\`\`\`json
{
  "id": "vuln_001",
  "title": "SQL Injection in Login Form",
  "description": "A SQL injection vulnerability was discovered in the login form. The 'username' parameter is not properly sanitized, allowing attackers to inject malicious SQL queries.",
  "severity": "critical",
  "cvss_score": 9.8,
  "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
  "status": "open",
  "scan_id": "scan_xyz789",
  "endpoint": "/api/login",
  "method": "POST",
  "parameter": "username",
  "proof_of_concept": {
    "request": "POST /api/login HTTP/1.1\\nHost: example.com\\nContent-Type: application/json\\n\\n{\\"username\\":\\"admin' OR '1'='1\\",\\"password\\":\\"test\\"}",
    "response": "HTTP/1.1 500 Internal Server Error\\n\\nSQL syntax error near...",
    "steps": [
      "Navigate to the login page",
      "Enter the payload admin' OR '1'='1 in the username field",
      "Submit the form",
      "Observe the SQL error in the response"
    ]
  },
  "remediation": {
    "description": "Use parameterized queries or prepared statements to prevent SQL injection attacks.",
    "code_example": "cursor.execute('SELECT * FROM users WHERE username = ?', (username,))",
    "references": [
      "https://owasp.org/www-community/attacks/SQL_Injection",
      "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
    ]
  },
  "cwe_id": "CWE-89",
  "owasp_category": "A03:2021 - Injection",
  "discovered_at": "2025-01-06T12:30:00Z",
  "updated_at": "2025-01-06T12:30:00Z"
}
\`\`\`

## Update Vulnerability Status

Update the status of a vulnerability.

\`\`\`bash
PATCH /api/vulnerabilities/{vulnerability_id}
\`\`\`

### Request Body

\`\`\`json
{
  "status": "confirmed",
  "notes": "Verified by the security team. Assigned to backend developers."
}
\`\`\`

### Valid Status Values

| Status | Description |
|--------|-------------|
| open | Newly discovered, unreviewed |
| confirmed | Verified as valid vulnerability |
| false_positive | Marked as not a real issue |
| resolved | Fixed and verified |

## Bulk Update Vulnerabilities

Update multiple vulnerabilities at once.

\`\`\`bash
PATCH /api/vulnerabilities/bulk
\`\`\`

### Request Body

\`\`\`json
{
  "vulnerability_ids": ["vuln_001", "vuln_002", "vuln_003"],
  "status": "confirmed"
}
\`\`\`

## Export Vulnerabilities

Export vulnerabilities in various formats.

\`\`\`bash
GET /api/vulnerabilities/export
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | Export format (json, csv, pdf, sarif) |
| scan_id | string | Filter by scan |
| severity | string | Filter by minimum severity |

### Response Headers

\`\`\`
Content-Type: application/pdf
Content-Disposition: attachment; filename="vulnerabilities_report.pdf"
\`\`\`
`,
  apiWebhooks: `
# Webhooks

Receive real-time notifications when events occur in your Cyrion account.

## Overview

Webhooks allow you to build integrations that subscribe to specific events. When an event occurs, Cyrion sends an HTTP POST request to your configured endpoint.

## Supported Events

| Event | Description |
|-------|-------------|
| scan.created | A new scan was created |
| scan.started | A scan began execution |
| scan.completed | A scan finished successfully |
| scan.failed | A scan encountered an error |
| scan.paused | A scan was paused |
| scan.stopped | A scan was manually stopped |
| vulnerability.discovered | A new vulnerability was found |
| vulnerability.updated | A vulnerability status changed |

## Create a Webhook

\`\`\`bash
POST /api/webhooks
\`\`\`

### Request Body

\`\`\`json
{
  "name": "Slack Notifications",
  "url": "https://your-server.com/cyrion-webhook",
  "events": ["scan.completed", "vulnerability.discovered"],
  "secret": "whsec_your_webhook_secret",
  "is_active": true
}
\`\`\`

### Response

\`\`\`json
{
  "id": "wh_abc123",
  "name": "Slack Notifications",
  "url": "https://your-server.com/cyrion-webhook",
  "events": ["scan.completed", "vulnerability.discovered"],
  "is_active": true,
  "created_at": "2025-01-06T10:00:00Z"
}
\`\`\`

## List Webhooks

\`\`\`bash
GET /api/webhooks
\`\`\`

## Update a Webhook

\`\`\`bash
PATCH /api/webhooks/{webhook_id}
\`\`\`

## Delete a Webhook

\`\`\`bash
DELETE /api/webhooks/{webhook_id}
\`\`\`

## Webhook Payload Format

All webhook payloads follow this structure:

\`\`\`json
{
  "id": "evt_123456",
  "event": "vulnerability.discovered",
  "timestamp": "2025-01-06T12:30:00Z",
  "data": {
    "vulnerability_id": "vuln_xyz789",
    "scan_id": "scan_abc123",
    "title": "SQL Injection in Login Form",
    "severity": "critical",
    "endpoint": "/api/login"
  }
}
\`\`\`

## Scan Events Payload

\`\`\`json
{
  "id": "evt_789012",
  "event": "scan.completed",
  "timestamp": "2025-01-06T14:30:00Z",
  "data": {
    "scan_id": "scan_abc123",
    "name": "Production Web App Scan",
    "status": "completed",
    "duration_seconds": 16200,
    "vulnerabilities_found": 12,
    "statistics": {
      "critical": 2,
      "high": 4,
      "medium": 3,
      "low": 2,
      "info": 1
    }
  }
}
\`\`\`

## Verifying Webhook Signatures

All webhook requests include a signature header for verification:

\`\`\`
X-Cyrion-Signature: sha256=abc123...
\`\`\`

### Verification Example (Node.js)

\`\`\`javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Express.js example
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const signature = req.headers['x-cyrion-signature'];
  const isValid = verifyWebhookSignature(req.body, signature, WEBHOOK_SECRET);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body);
  // Process the event...

  res.status(200).send('OK');
});
\`\`\`

### Verification Example (Python)

\`\`\`python
import hmac
import hashlib

def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    expected = 'sha256=' + hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)

# Flask example
@app.route('/webhook', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Cyrion-Signature')
    if not verify_webhook_signature(request.data, signature, WEBHOOK_SECRET):
        return 'Invalid signature', 401

    event = request.json
    # Process the event...

    return 'OK', 200
\`\`\`

## Retry Policy

Failed webhook deliveries are retried with exponential backoff:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts, the webhook is marked as failing and you'll receive an email notification.
`,
  // Releases
  releaseV210: `
# v2.1.0 Release Notes

**Released: January 2025**

## New Features

### Enhanced Mobile Analysis
- Added support for Flutter applications
- Improved React Native decompilation
- New certificate pinning detection

### Agent Improvements
- Smarter context retention across tool calls
- Reduced false positive rate by 40%
- Better handling of multi-step authentication

## Bug Fixes

- Fixed issue with large file uploads timing out
- Resolved WebSocket connection drops on long scans
- Fixed pagination in vulnerability exports

## Breaking Changes

None in this release.

## Migration Guide

No migration required. Update your SDK to the latest version.
`,
  releaseV200: `
# v2.0.0 Release Notes

**Released: November 2024**

## Major Release

This is a major release with significant improvements to the agent architecture.

## New Features

### Redesigned Agent Architecture
- Completely rewritten reasoning engine
- Support for multi-agent collaboration
- Improved tool selection accuracy

### New Platforms
- Added iOS support (IPA analysis)
- Cloud infrastructure scanning (AWS, GCP, Azure)

### Dashboard Updates
- Real-time activity visualization
- Enhanced vulnerability timeline
- Export to multiple formats

## Breaking Changes

- API v0 endpoints deprecated
- Webhook payload format updated
- SDK minimum version requirements changed

## Migration Guide

See the [migration guide](/docs/migration/v2) for detailed instructions.
`,
  releaseV150: `
# v1.5.0 Release Notes

**Released: September 2024**

## Features

### API Enhancements
- New webhook events
- Batch vulnerability updates
- Improved rate limit headers

### Performance
- 50% faster scan initialization
- Reduced memory usage in sandboxes
- Optimized database queries

## Bug Fixes

- Fixed scan status not updating correctly
- Resolved authentication token refresh issues
- Fixed CSV export encoding problems
`,
  releaseV100: `
# v1.0.0 Release Notes

**Released: June 2024**

## Initial Release

Cyrion AI is officially launched!

## Features

- Autonomous web security scanning
- Android (APK) analysis
- AI-powered vulnerability discovery
- Real-time activity monitoring
- Comprehensive reporting

## Getting Started

Check out our [Quickstart Guide](/quickstart) to begin using Cyrion.
`,
}

// Route configuration mapping paths to content keys
const ROUTES: Record<string, keyof typeof CONTENT> = {
  '/': 'intro',
  '/quickstart': 'quickstart',
  '/architecture': 'architecture',
  '/features/scans': 'scans',
  '/features/agents': 'agents',
  '/platforms/mobile': 'mobile',
  '/api': 'apiOverview',
  '/api/authentication': 'apiAuth',
  '/api/scans': 'apiScans',
  '/api/vulnerabilities': 'apiVulnerabilities',
  '/api/webhooks': 'apiWebhooks',
  '/releases/v2.1.0': 'releaseV210',
  '/releases/v2.0.0': 'releaseV200',
  '/releases/v1.5.0': 'releaseV150',
  '/releases/v1.0.0': 'releaseV100',
}

function DocumentationPage() {
  const location = useLocation()
  const contentKey = ROUTES[location.pathname] || 'intro'
  const content = CONTENT[contentKey]
  const headings = useMemo(() => extractHeadings(content), [content])

  return (
    <Layout headings={headings}>
      <MarkdownContent content={content} />
    </Layout>
  )
}

function NotFoundPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-6xl font-bold text-dark-500 mb-4">404</h1>
        <p className="text-xl text-dark-200 mb-8">This documentation page is still being written.</p>
        <a href="/" className="px-6 py-3 bg-accent-cyan text-dark-900 font-semibold rounded-lg hover:bg-accent-cyan/90 transition-all">
          Back to Introduction
        </a>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        {Object.keys(ROUTES).map((path) => (
          <Route key={path} path={path} element={<DocumentationPage />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}
