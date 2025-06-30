# Workflow Tools

This page documents the tools available for managing n8n workflows.

## Overview

Workflow tools allow AI assistants to manage n8n workflows, including creating, retrieving, updating, deleting, activating, and deactivating workflows. These tools provide a natural language interface to n8n's workflow management capabilities.

## Available Tools

### workflow_list

Lists all workflows with optional filtering.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "active": {
      "type": "boolean",
      "description": "Filter workflows by active status"
    }
  },
  "required": []
}
```

**Example Usage:**

```javascript
// List all workflows
const result = await useWorkflowList({});

// List only active workflows
const activeWorkflows = await useWorkflowList({ active: true });

// List only inactive workflows
const inactiveWorkflows = await useWorkflowList({ active: false });
```

**Response:**

```javascript
[
  {
    "id": "1234abc",
    "name": "Test Workflow 1",
    "active": true,
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-02T14:30:00.000Z"
  },
  {
    "id": "5678def",
    "name": "Test Workflow 2",
    "active": false,
    "createdAt": "2025-03-01T12:00:00.000Z",
    "updatedAt": "2025-03-12T10:15:00.000Z"
  }
]
```

### workflow_get

Retrieves a specific workflow by ID.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "The ID of the workflow to retrieve"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const workflow = await useWorkflowGet({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": true,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-02T14:30:00.000Z",
  "nodes": [
    // Detailed node configuration
  ],
  "connections": {
    // Connection configuration
  },
  "settings": {
    // Workflow settings
  }
}
```

### workflow_create

Creates a new workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Name of the workflow"
    },
    "nodes": {
      "type": "array",
      "description": "Array of node configurations"
    },
    "connections": {
      "type": "object",
      "description": "Connection configuration"
    },
    "active": {
      "type": "boolean",
      "description": "Whether the workflow should be active"
    },
    "settings": {
      "type": "object",
      "description": "Workflow settings"
    }
  },
  "required": ["name"]
}
```

**Example Usage:**

```javascript
const newWorkflow = await useWorkflowCreate({
  name: "New Workflow",
  active: true,
  nodes: [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [100, 200],
      "parameters": {}
    }
  ],
  connections: {}
});
```

**Response:**

```javascript
{
  "id": "new123",
  "name": "New Workflow",
  "active": true,
  "createdAt": "2025-03-12T15:30:00.000Z",
  "updatedAt": "2025-03-12T15:30:00.000Z",
  "nodes": [
    {
      "name": "Start",
      "type": "n8n-nodes-base.start",
      "position": [100, 200],
      "parameters": {}
    }
  ],
  "connections": {}
}
```

### workflow_update

Updates an existing workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to update"
    },
    "name": {
      "type": "string",
      "description": "New name for the workflow"
    },
    "nodes": {
      "type": "array",
      "description": "Updated array of node configurations"
    },
    "connections": {
      "type": "object",
      "description": "Updated connection configuration"
    },
    "active": {
      "type": "boolean",
      "description": "Whether the workflow should be active"
    },
    "settings": {
      "type": "object",
      "description": "Updated workflow settings"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const updatedWorkflow = await useWorkflowUpdate({
  id: "1234abc",
  name: "Updated Workflow Name",
  active: false
});
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Updated Workflow Name",
  "active": false,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T15:45:00.000Z",
  "nodes": [
    // Existing node configuration
  ],
  "connections": {
    // Existing connection configuration
  }
}
```

### workflow_delete

Deletes a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to delete"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
await useWorkflowDelete({ id: "1234abc" });
```

**Response:**

```javascript
{
  "success": true
}
```

### workflow_activate

Activates a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to activate"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const activatedWorkflow = await useWorkflowActivate({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": true,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T16:00:00.000Z"
}
```

### workflow_deactivate

Deactivates a workflow.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ID of the workflow to deactivate"
    }
  },
  "required": ["id"]
}
```

**Example Usage:**

```javascript
const deactivatedWorkflow = await useWorkflowDeactivate({ id: "1234abc" });
```

**Response:**

```javascript
{
  "id": "1234abc",
  "name": "Test Workflow 1",
  "active": false,
  "createdAt": "2025-03-01T12:00:00.000Z",
  "updatedAt": "2025-03-12T16:15:00.000Z"
}
```

## SOP (Standard Operating Procedure) Tools

The following tools provide intelligent SOP-to-workflow conversion capabilities:

### generate_sop_plan_prompt

Generates a comprehensive analysis prompt for converting SOP text into n8n workflow implementation plans.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "sopText": {
      "type": "string",
      "description": "The SOP text to embed within the analysis framework"
    },
    "sopTitle": {
      "type": "string",
      "description": "Title/name for the SOP (optional, defaults to 'SOP Analysis')"
    }
  },
  "required": ["sopText"]
}
```

**Example Usage:**

```javascript
const sopPlan = await generateSopPlanPrompt({
  sopText: "Customer Support SOP: When a customer submits a support ticket...",
  sopTitle: "Customer Support Process"
});
```

**Response:**

```javascript
{
  "sopPlanPrompt": "# Intelligent n8n SOP Analysis\n\n## Core Directive\n...", // Full analysis prompt
  "promptLength": 15432,
  "sopTitle": "Customer Support Process",
  "usage": "Copy the 'sopPlanPrompt' and paste it to an AI with MCP tools to generate the implementation plan"
}
```

### execute_sop_plan

Executes an SOP implementation plan by creating a validated n8n workflow with proper error handling and structure.

**Input Schema:**

```json
{
  "type": "object",
  "properties": {
    "implementationPlan": {
      "type": "string",
      "description": "The complete SOP implementation plan (typically generated from SOP analysis)"
    },
    "workflowName": {
      "type": "string",
      "description": "Name for the workflow to be created"
    },
    "workflowDescription": {
      "type": "string",
      "description": "Optional description for the workflow"
    },
    "dryRun": {
      "type": "boolean",
      "description": "If true, returns the workflow creation prompt instead of actually creating the workflow (default: false)"
    },
    "autoActivate": {
      "type": "boolean",
      "description": "Whether to activate the workflow immediately after creation (default: false)"
    }
  },
  "required": ["implementationPlan", "workflowName"]
}
```

**Example Usage:**

```javascript
// Dry run mode - returns structured prompt for manual execution
const dryRunResult = await executeSopPlan({
  implementationPlan: "Implementation plan from SOP analysis...",
  workflowName: "Customer Support Workflow",
  workflowDescription: "Handles customer support ticket processing",
  dryRun: true
});

// Production mode - creates actual workflow
const workflowResult = await executeSopPlan({
  implementationPlan: "Implementation plan from SOP analysis...",
  workflowName: "Customer Support Workflow",
  workflowDescription: "Handles customer support ticket processing",
  autoActivate: false
});
```

**Response (Dry Run Mode):**

```javascript
{
  "workflowCreationPrompt": "# n8n Workflow Creation Assistant\n\n## Core Directive\n...", // Full creation prompt
  "promptLength": 12845,
  "workflowName": "Customer Support Workflow",
  "mode": "DRY_RUN",
  "usage": "Copy the 'workflowCreationPrompt' and execute it with an AI that has MCP n8n tools to create the workflow"
}
```

**Response (Production Mode):**

```javascript
{
  "workflowId": "workflow-abc123",
  "workflowName": "Customer Support Workflow",
  "active": false,
  "createdAt": "2025-01-12T15:30:00.000Z",
  "message": "Workflow created successfully from SOP plan"
}
```

## SOP Workflow Process

The typical SOP-to-workflow conversion process follows these steps:

1. **SOP Analysis**: Use `generate_sop_plan_prompt` with your SOP text
2. **Plan Generation**: Execute the generated prompt with an AI that has MCP tools to create implementation plan
3. **Workflow Creation**: Use `execute_sop_plan` with the implementation plan to create the n8n workflow

**Complete Example Flow:**

```javascript
// Step 1: Generate analysis prompt
const sopAnalysis = await generateSopPlanPrompt({
  sopText: `Customer Support SOP:
    1. When a ticket is received, validate customer information
    2. Categorize the issue type (technical, billing, general)
    3. Route to appropriate team based on category
    4. Send acknowledgment email to customer
    5. If technical issue, escalate to L2 if not resolved in 4 hours`,
  sopTitle: "Customer Support Process"
});

// Step 2: [Execute the sopAnalysis.sopPlanPrompt with AI to get implementation plan]

// Step 3: Create workflow from implementation plan
const workflow = await executeSopPlan({
  implementationPlan: implementationPlanFromAI,
  workflowName: "Customer Support Automation",
  workflowDescription: "Automated customer support ticket processing",
  autoActivate: false
});
```

## Error Handling

All workflow tools can return the following errors:

| Error | Description |
|-------|-------------|
| Authentication Error | The provided API key is invalid or missing |
| Not Found Error | The requested workflow does not exist |
| Validation Error | The input parameters are invalid or incomplete |
| Permission Error | The API key does not have permission to perform the operation |
| Server Error | An unexpected error occurred on the n8n server |

## Best Practices

- Use `workflow_list` to discover available workflows before performing operations
- Validate workflow IDs before attempting to update or delete workflows
- Check workflow status (active/inactive) before attempting activation/deactivation
- Include only the necessary fields when updating workflows to avoid unintended changes
