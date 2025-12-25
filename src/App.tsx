import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import MarkdownContent from './components/MarkdownContent'

// Mock content for now - in a real app these would be .md files
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

---

> **Note**: Cyrion is designed for professional security researchers and authorized testing only. Always ensure you have explicit permission before testing any target.
`,
  quickstart: `
# Quickstart

Get up and running with your first autonomous security scan in minutes.

## 1. Create an Account
Sign up at [app.cyrion.ai](https://app.cyrion.ai) and verify your email.

## 2. Configure Your Environment
Go to **Settings** and add your API keys for your preferred LLM provider (OpenRouter, OpenAI, or Anthropic).

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

## iOS Assessment
- **Binary Analysis**: Mach-O binary inspection with Radare2.
- **Plist Analysis**: Reviewing Info.plist for insecure configurations.
- **URL Scheme Testing**: Identifying custom URL scheme vulnerabilities.

## How to Test Mobile Apps
Simply upload your \`.apk\`, \`.aab\`, or \`.ipa\` file when starting a new scan. Cyrion will automatically provision a sandbox with the mobile testing toolchain.
`,
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MarkdownContent content={CONTENT.intro} />} />
          <Route path="/quickstart" element={<MarkdownContent content={CONTENT.quickstart} />} />
          <Route path="/architecture" element={<MarkdownContent content={CONTENT.architecture} />} />
          <Route path="/features/scans" element={<MarkdownContent content={CONTENT.scans} />} />
          <Route path="/features/agents" element={<MarkdownContent content={CONTENT.agents} />} />
          <Route path="/platforms/mobile" element={<MarkdownContent content={CONTENT.mobile} />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h1 className="text-6xl font-bold text-dark-500 mb-4">404</h1>
              <p className="text-xl text-dark-200 mb-8">This documentation page is still being written.</p>
              <a href="/" className="btn-primary">Back to Introduction</a>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  )
}