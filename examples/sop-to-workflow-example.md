# SOP to n8n Workflow Conversion Example

This example demonstrates the complete process of converting a Standard Operating Procedure (SOP) into a fully functional n8n workflow using our MCP tools.

## Overview

The process involves three main steps:
1. **SOP Analysis**: Generate an analysis prompt from your SOP text
2. **Implementation Planning**: Use AI with MCP tools to create a detailed implementation plan
3. **Workflow Creation**: Convert the plan into an actual n8n workflow

## Example SOP: Customer Support Process

Let's use this sample customer support SOP:

```
Customer Support Standard Operating Procedure

1. TICKET INTAKE
   - When a support ticket is received via email or web form
   - Validate customer information (email, account status)
   - If customer not found, create new customer record
   - If customer account is suspended, route to billing team

2. ISSUE CATEGORIZATION
   - Analyze ticket content for keywords
   - Categorize as: Technical, Billing, General Inquiry, or Bug Report
   - Set priority level: Low, Medium, High, Critical
   - Technical issues with "server down" or "outage" = Critical priority

3. ROUTING AND ASSIGNMENT
   - Technical issues → Technical Support Team
   - Billing issues → Billing Team  
   - Bug reports → Development Team
   - General inquiries → General Support Team
   - Critical priority issues → Send SMS alert to team lead

4. CUSTOMER COMMUNICATION
   - Send immediate acknowledgment email with ticket number
   - Include estimated response time based on priority
   - If issue is resolved immediately, send resolution email
   - If escalated, notify customer of escalation

5. ESCALATION RULES
   - If no response within 4 hours (business hours) → Escalate to team lead
   - If customer replies "URGENT" → Immediately escalate
   - If issue affects multiple customers → Mark as incident, notify management

6. RESOLUTION AND FOLLOW-UP
   - Mark ticket as resolved when fixed
   - Send resolution confirmation to customer
   - Follow up after 24 hours to ensure satisfaction
   - Close ticket if customer confirms resolution
```

## Step 1: Generate SOP Analysis Prompt

First, we use the `generate_sop_plan_prompt` tool to create a comprehensive analysis prompt:

```javascript
const sopAnalysis = await generateSopPlanPrompt({
  sopText: `Customer Support Standard Operating Procedure

1. TICKET INTAKE
   - When a support ticket is received via email or web form
   - Validate customer information (email, account status)
   - If customer not found, create new customer record
   - If customer account is suspended, route to billing team

2. ISSUE CATEGORIZATION
   - Analyze ticket content for keywords
   - Categorize as: Technical, Billing, General Inquiry, or Bug Report
   - Set priority level: Low, Medium, High, Critical
   - Technical issues with "server down" or "outage" = Critical priority

3. ROUTING AND ASSIGNMENT
   - Technical issues → Technical Support Team
   - Billing issues → Billing Team  
   - Bug reports → Development Team
   - General inquiries → General Support Team
   - Critical priority issues → Send SMS alert to team lead

4. CUSTOMER COMMUNICATION
   - Send immediate acknowledgment email with ticket number
   - Include estimated response time based on priority
   - If issue is resolved immediately, send resolution email
   - If escalated, notify customer of escalation

5. ESCALATION RULES
   - If no response within 4 hours (business hours) → Escalate to team lead
   - If customer replies "URGENT" → Immediately escalate
   - If issue affects multiple customers → Mark as incident, notify management

6. RESOLUTION AND FOLLOW-UP
   - Mark ticket as resolved when fixed
   - Send resolution confirmation to customer
   - Follow up after 24 hours to ensure satisfaction
   - Close ticket if customer confirms resolution`,
  sopTitle: "Customer Support Process"
});

// Result contains a comprehensive analysis prompt
console.log('Generated prompt length:', sopAnalysis.promptLength);
console.log('Usage instructions:', sopAnalysis.usage);
```

## Step 2: Execute Analysis Prompt (AI Processing)

Take the `sopAnalysis.sopPlanPrompt` and execute it with an AI assistant that has access to MCP n8n tools. The AI will:

1. Analyze the existing n8n environment using MCP tools
2. Understand the SOP requirements
3. Generate a detailed implementation plan

**Sample AI Response (Implementation Plan):**

```
# Customer Support Workflow Implementation Plan

## Workflow Overview
Create a comprehensive customer support automation workflow that handles ticket intake, categorization, routing, and escalation according to the SOP.

## Required Nodes and Configuration

### 1. Webhook Trigger Node
- **Type**: `n8n-nodes-base.webhook`
- **Purpose**: Receive incoming support tickets
- **Configuration**:
  - HTTP Method: POST
  - Path: /support-ticket
  - Response Mode: Respond When Last Node
  - Authentication: HTTP Basic Auth

### 2. Customer Validation Node
- **Type**: `n8n-nodes-base.function`
- **Purpose**: Validate customer information and account status
- **Logic**:
  - Check if customer email exists in database
  - Verify account status (active, suspended, etc.)
  - Create new customer record if not found

### 3. Issue Categorization Node  
- **Type**: `n8n-nodes-base.function`
- **Purpose**: Analyze ticket content and categorize
- **Logic**:
  - Keyword analysis for issue type
  - Priority assignment based on content
  - Critical priority detection for server/outage issues

### 4. Routing Switch Node
- **Type**: `n8n-nodes-base.switch`
- **Purpose**: Route tickets to appropriate teams
- **Conditions**:
  - Technical issues → Technical Support Team
  - Billing issues → Billing Team
  - Bug reports → Development Team
  - General inquiries → General Support Team

### 5. Team Assignment Nodes
- **Type**: `n8n-nodes-base.httpRequest` (for each team)
- **Purpose**: Assign tickets to team systems
- **Configuration**: API calls to team management systems

### 6. Customer Acknowledgment Node
- **Type**: `n8n-nodes-base.emailSend`
- **Purpose**: Send immediate acknowledgment
- **Configuration**:
  - Dynamic response time based on priority
  - Include ticket number
  - Personalized content

### 7. Critical Alert Node
- **Type**: `n8n-nodes-base.telegram` or SMS service
- **Purpose**: Alert team leads for critical issues
- **Trigger**: Only for Critical priority tickets

### 8. Escalation Timer Node
- **Type**: `n8n-nodes-base.schedule`
- **Purpose**: Handle escalation after 4 hours
- **Configuration**: Trigger workflow for unresolved tickets

## Workflow Structure

```
Webhook → Customer Validation → Issue Categorization → Routing Switch
    ↓
[Technical] → Tech Team Assignment → Acknowledgment Email
    ↓
[Billing] → Billing Team Assignment → Acknowledgment Email  
    ↓
[Bug Report] → Dev Team Assignment → Acknowledgment Email
    ↓
[General] → Support Team Assignment → Acknowledgment Email
    ↓
[Critical Priority] → Critical Alert (SMS/Telegram) → Team Assignment
    ↓
All paths → Escalation Timer Setup
```

## Implementation Requirements

### Database Integration
- Customer database API for validation
- Ticket tracking system integration
- Team assignment system APIs

### Email Configuration
- SMTP server for acknowledgment emails
- Email templates for different scenarios
- Dynamic content generation

### Alert Systems
- SMS service integration for critical alerts
- Team lead contact information
- Escalation notification system

### Error Handling
- Invalid customer data handling
- API failure fallbacks
- Notification system for failures

## Testing Checklist
- [ ] Webhook receives tickets correctly
- [ ] Customer validation works for existing/new customers
- [ ] Issue categorization assigns correct categories and priorities
- [ ] Routing sends tickets to correct teams
- [ ] Acknowledgment emails are sent promptly
- [ ] Critical alerts trigger for high-priority issues
- [ ] Escalation system activates after specified time
- [ ] Error handling manages failures gracefully
```

## Step 3: Create Workflow from Implementation Plan

Now use the `execute_sop_plan` tool to create the actual workflow:

### Option A: Dry Run (Recommended for Testing)

```javascript
const dryRunResult = await executeSopPlan({
  implementationPlan: implementationPlanFromAI, // The plan generated above
  workflowName: "Customer Support Automation",
  workflowDescription: "Automated customer support ticket processing according to company SOP",
  dryRun: true
});

// This returns a structured prompt for creating the workflow
console.log('Workflow creation prompt ready:', dryRunResult.promptLength, 'characters');
// Copy the workflowCreationPrompt and execute with AI to create the workflow
```

### Option B: Direct Creation

```javascript
const workflowResult = await executeSopPlan({
  implementationPlan: implementationPlanFromAI,
  workflowName: "Customer Support Automation",
  workflowDescription: "Automated customer support ticket processing according to company SOP",
  autoActivate: false // Keep inactive initially for testing
});

console.log('Workflow created successfully!');
console.log('Workflow ID:', workflowResult.workflowId);
console.log('Workflow Name:', workflowResult.workflowName);
console.log('Status:', workflowResult.active ? 'Active' : 'Inactive');
```

## Expected Results

After completing this process, you'll have:

1. **A Functional n8n Workflow** that implements your SOP
2. **Proper Node Structure** with webhook triggers, decision logic, and integrations
3. **Error Handling** for common failure scenarios
4. **Scalable Architecture** that can be extended and modified

## Next Steps

1. **Test the Workflow**: Use test data to verify all paths work correctly
2. **Configure Integrations**: Set up actual API keys and system connections
3. **Activate Workflow**: Enable the workflow for production use
4. **Monitor Performance**: Track workflow execution and optimize as needed
5. **Iterate and Improve**: Refine the workflow based on real-world usage

## Benefits of This Approach

- **Consistency**: Every SOP is analyzed systematically
- **Intelligence**: AI understands complex business logic and requirements
- **Validation**: Built-in checks ensure workflows follow n8n best practices
- **Flexibility**: Both dry-run and direct creation modes available
- **Scalability**: Process works for simple to complex SOPs

## Troubleshooting

### Common Issues

1. **SOP Too Complex**: Break down into smaller, focused SOPs
2. **Missing API Information**: Ensure all external system APIs are documented
3. **Unclear Business Logic**: Add more specific decision criteria to SOP
4. **Integration Failures**: Verify API credentials and endpoint availability

### Getting Help

- Check workflow execution logs in n8n
- Review generated prompts for clarity
- Test individual workflow nodes
- Consult n8n documentation for node-specific issues 