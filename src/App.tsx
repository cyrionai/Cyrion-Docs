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
# API Overview

The Cyrion API allows you to programmatically interact with the platform.

## Base URL

All API requests should be made to:

\`\`\`
https://api.cyrion.ai/v1
\`\`\`

## Authentication

All API requests require authentication using an API key in the header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.cyrion.ai/v1/scans
\`\`\`

## Rate Limits

| Plan | Requests/min | Concurrent Scans |
|------|-------------|------------------|
| Free | 60 | 1 |
| Pro | 300 | 5 |
| Enterprise | Unlimited | Unlimited |

## Response Format

All responses are returned in JSON format:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 100
  }
}
\`\`\`

## Error Handling

Errors follow standard HTTP status codes with detailed messages:

\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_TARGET",
    "message": "The provided target URL is invalid"
  }
}
\`\`\`
`,
  apiAuth: `
# Authentication

Learn how to authenticate with the Cyrion API.

## API Keys

API keys are used to authenticate requests to the Cyrion API.

### Creating an API Key

1. Go to **Settings** > **API Keys** in the dashboard
2. Click **"Create New Key"**
3. Give your key a descriptive name
4. Copy the key (it won't be shown again)

## Using API Keys

Include your API key in the \`Authorization\` header:

\`\`\`bash
curl -X GET "https://api.cyrion.ai/v1/scans" \\
  -H "Authorization: Bearer cy_live_xxxxxxxxxxxx"
\`\`\`

## Key Types

### Live Keys
- Prefix: \`cy_live_\`
- Full access to production features
- Rate limited based on plan

### Test Keys
- Prefix: \`cy_test_\`
- Limited to sandbox environments
- No billing impact

## Security Best Practices

- Never commit API keys to version control
- Rotate keys regularly
- Use environment variables
- Set appropriate scopes for each key
`,
  apiScans: `
# Scans API

Create and manage security scans programmatically.

## Create a Scan

\`\`\`bash
POST /v1/scans
\`\`\`

### Request Body

\`\`\`json
{
  "target": "https://example.com",
  "type": "web",
  "rules_of_engagement": {
    "in_scope": ["*.example.com"],
    "out_of_scope": ["admin.example.com"]
  },
  "max_iterations": 200
}
\`\`\`

### Response

\`\`\`json
{
  "success": true,
  "data": {
    "id": "scan_abc123",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

## List Scans

\`\`\`bash
GET /v1/scans
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status |
| page | integer | Page number |
| limit | integer | Results per page |

## Get Scan Details

\`\`\`bash
GET /v1/scans/:id
\`\`\`

## Stop a Scan

\`\`\`bash
POST /v1/scans/:id/stop
\`\`\`
`,
  apiVulnerabilities: `
# Vulnerabilities API

Retrieve and manage discovered vulnerabilities.

## List Vulnerabilities

\`\`\`bash
GET /v1/vulnerabilities
\`\`\`

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| scan_id | string | Filter by scan |
| severity | string | Filter by severity |
| status | string | Filter by status |

### Response

\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "vuln_xyz789",
      "title": "SQL Injection in Login Form",
      "severity": "critical",
      "status": "open",
      "scan_id": "scan_abc123",
      "created_at": "2024-01-15T12:30:00Z"
    }
  ]
}
\`\`\`

## Get Vulnerability Details

\`\`\`bash
GET /v1/vulnerabilities/:id
\`\`\`

### Response

\`\`\`json
{
  "success": true,
  "data": {
    "id": "vuln_xyz789",
    "title": "SQL Injection in Login Form",
    "description": "...",
    "severity": "critical",
    "poc": "...",
    "remediation": "...",
    "references": [...]
  }
}
\`\`\`

## Update Vulnerability Status

\`\`\`bash
PATCH /v1/vulnerabilities/:id
\`\`\`

### Request Body

\`\`\`json
{
  "status": "resolved"
}
\`\`\`
`,
  apiWebhooks: `
# Webhooks

Receive real-time notifications about scan events.

## Overview

Webhooks allow you to receive HTTP callbacks when events occur in your Cyrion account.

## Supported Events

| Event | Description |
|-------|-------------|
| scan.started | A scan has begun execution |
| scan.completed | A scan finished successfully |
| scan.failed | A scan encountered an error |
| vulnerability.found | A new vulnerability was discovered |

## Creating a Webhook

\`\`\`bash
POST /v1/webhooks
\`\`\`

### Request Body

\`\`\`json
{
  "url": "https://your-server.com/webhook",
  "events": ["scan.completed", "vulnerability.found"],
  "secret": "your_webhook_secret"
}
\`\`\`

## Webhook Payload

\`\`\`json
{
  "event": "vulnerability.found",
  "timestamp": "2024-01-15T12:30:00Z",
  "data": {
    "vulnerability_id": "vuln_xyz789",
    "scan_id": "scan_abc123",
    "severity": "critical"
  }
}
\`\`\`

## Verifying Webhooks

Verify webhook signatures using HMAC-SHA256:

\`\`\`javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return signature === expected;
}
\`\`\`
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
