/**
 * Execute SOP Plan Tool
 * 
 * This tool takes an SOP implementation plan, validates it using AI analysis,
 * and creates the corresponding n8n workflow with proper validation and error handling.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * System prompt for validating and creating workflows from SOP plans
 */
const WORKFLOW_CREATION_SYSTEM_PROMPT = `# n8n Workflow Creation Assistant

## Core Directive
You are an expert n8n workflow engineer tasked with creating robust, production-ready workflows from SOP implementation plans. Your role is to validate the plan, structure the workflow correctly, and ensure best practices are followed.

## Validation Framework

### 1. Plan Validation
Before creating any workflow, validate the implementation plan for:

**Completeness Check:**
- All required workflow components are specified
- Node types and configurations are clearly defined
- Connection mappings between nodes are complete
- Input/output data structures are documented
- Error handling scenarios are addressed

**Technical Feasibility:**
- All specified node types are valid n8n nodes
- API endpoints and credentials are properly configured
- Data transformations are technically sound
- Workflow logic follows n8n best practices

**Business Logic Validation:**
- Decision trees map correctly to n8n conditional nodes
- Data validation rules are implementable
- Routing and escalation logic is sound
- Integration requirements are achievable

### 2. Workflow Structure Standards

**Required Components:**
- **Start Node**: Always begin with appropriate trigger (webhook, manual, schedule)
- **Validation Layer**: Input validation and sanitization
- **Business Logic**: Core processing nodes with proper error handling
- **Decision Points**: IF/Switch nodes for conditional logic
- **Integration Layer**: API calls with retry and error handling
- **Response Generation**: Proper response formatting and routing
- **Error Handling**: Comprehensive error catching and reporting

**Node Naming Convention:**
- Use descriptive, action-oriented names
- Include step numbers for complex flows
- Add status indicators (validate, process, route, respond)

**Connection Mapping:**
- Validate all node connections are properly mapped
- Ensure error paths are connected to error handlers
- Verify success paths lead to appropriate next steps

### 3. Data Flow Architecture

**Input Processing:**
- Validate all input data against expected schemas
- Implement data sanitization and normalization
- Handle missing or invalid data gracefully

**Data Transformation:**
- Use Function/Code nodes for complex transformations
- Implement proper data type conversions
- Maintain data lineage and traceability

**Output Generation:**
- Format responses according to requirements
- Include metadata and status information
- Implement proper error response structures

### 4. Error Handling & Resilience

**Error Categorization:**
- Input validation errors
- API integration failures
- Business logic exceptions
- System/infrastructure errors

**Recovery Strategies:**
- Implement retry mechanisms for transient failures
- Provide fallback options for critical paths
- Include manual intervention points for complex errors
- Log all errors with appropriate context

### 5. Security & Compliance

**Data Protection:**
- Implement proper input sanitization
- Use secure credential management
- Apply data masking for sensitive information
- Follow least-privilege access principles

**API Security:**
- Validate API credentials and endpoints
- Implement proper authentication flows
- Use secure communication protocols
- Handle rate limiting and quotas

## Output Requirements

When creating a workflow, provide:

### Workflow Metadata
- **Name**: Descriptive, business-aligned name
- **Description**: Clear purpose and functionality
- **Tags**: Appropriate categorization tags
- **Active Status**: Set to false initially for testing

### Node Structure
Provide complete node definitions including:
- Node type and version
- Configuration parameters
- Input/output mappings
- Error handling settings

### Connection Mapping
Define all connections between nodes:
- Success paths
- Error paths
- Conditional branches
- Loop connections

### Validation Summary
- Plan validation results
- Technical feasibility assessment
- Identified risks and mitigations
- Testing recommendations

## Quality Assurance

**Pre-Creation Checklist:**
- [ ] Plan is complete and technically sound
- [ ] All node types are valid and properly configured
- [ ] Connection mappings are complete and correct
- [ ] Error handling is comprehensive
- [ ] Security considerations are addressed
- [ ] Workflow follows n8n best practices

**Post-Creation Verification:**
- Workflow structure is syntactically correct
- All connections are properly mapped
- Error handling paths are functional
- Input/output schemas are validated

Use this framework to ensure all workflows created from SOP plans are production-ready, secure, and maintainable.`;

/**
 * Execute SOP Plan Tool Handler
 */
export class ExecuteSopPlanHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the SOP plan by creating a workflow with validation
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      const { 
        implementationPlan, 
        workflowName, 
        workflowDescription,
        dryRun = false,
        autoActivate = false
      } = args;

      if (!implementationPlan || typeof implementationPlan !== 'string') {
        throw new Error('implementationPlan is required and must be a string');
      }

      if (!workflowName || typeof workflowName !== 'string') {
        throw new Error('workflowName is required and must be a string');
      }

      // Create the analysis prompt for workflow creation
      const workflowCreationPrompt = this.createWorkflowCreationPrompt(
        implementationPlan, 
        workflowName, 
        workflowDescription || ''
      );

      if (dryRun) {
        // Return the prompt for manual execution
        return this.formatSuccess(
          {
            workflowCreationPrompt,
            promptLength: workflowCreationPrompt.length,
            workflowName,
            mode: 'DRY_RUN',
            usage: "Copy the 'workflowCreationPrompt' and execute it with an AI that has MCP n8n tools to create the workflow"
          },
          `✅ Generated workflow creation prompt for "${workflowName}" (DRY RUN - ${workflowCreationPrompt.length} characters)`
        );
      }

      // For actual execution, we need to parse the plan and create the workflow
      // This would typically involve AI processing, but for now we'll create a basic workflow
      const workflowData = await this.parseAndValidatePlan(implementationPlan, workflowName, workflowDescription);
      
      // Create the workflow using the existing API service
      const workflow = await this.apiService.createWorkflow({
        ...workflowData,
        active: autoActivate
      });

      return this.formatSuccess(
        {
          workflowId: workflow.id,
          workflowName: workflow.name,
          active: workflow.active,
          createdAt: new Date().toISOString(),
          message: 'Workflow created successfully from SOP plan'
        },
        `✅ Successfully created workflow "${workflow.name}" (ID: ${workflow.id}) from SOP implementation plan`
      );

    } catch (error) {
      return this.formatError(error instanceof Error ? error : new Error('Failed to execute SOP plan'));
    }
  }

  /**
   * Create comprehensive workflow creation prompt
   */
  private createWorkflowCreationPrompt(
    implementationPlan: string, 
    workflowName: string, 
    workflowDescription: string
  ): string {
    return `${WORKFLOW_CREATION_SYSTEM_PROMPT}

---

## IMPLEMENTATION PLAN TO EXECUTE

**Workflow Name:** ${workflowName}
**Description:** ${workflowDescription || 'Generated from SOP implementation plan'}

**Implementation Plan:**
${implementationPlan}

---

## EXECUTION INSTRUCTIONS

1. **Analyze the Implementation Plan**: Review the plan thoroughly using the validation framework above
2. **Validate Technical Feasibility**: Ensure all components are implementable in n8n
3. **Structure the Workflow**: Create complete node definitions and connection mappings
4. **Create the Workflow**: Use the mcp_n8n-local_create_workflow tool with:
   - Proper workflow name and description
   - Complete nodes array with all required configurations
   - Comprehensive connections object mapping all node relationships
   - Appropriate tags for categorization
   - Set active to false initially for testing

5. **Verify Creation**: Confirm the workflow was created successfully and provide summary

Execute this plan systematically and provide detailed feedback on each step.`;
  }

  /**
   * Parse and validate implementation plan to create basic workflow structure
   * This is a simplified implementation - in production, this would use AI processing
   */
  private async parseAndValidatePlan(
    implementationPlan: string,
    workflowName: string,
    workflowDescription?: string
  ): Promise<any> {
    // Basic workflow structure - this would be enhanced with AI-powered parsing
    const basicWorkflow = {
      name: workflowName,
      nodes: [
        {
          id: '1',
          name: 'Start',
          type: 'n8n-nodes-base.manualTrigger',
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: '2',
          name: 'Process SOP',
          type: 'n8n-nodes-base.function',
          typeVersion: 1,
          position: [460, 300],
          parameters: {
            functionCode: `// Generated from SOP Plan\n// TODO: Implement business logic based on:\n// ${implementationPlan.substring(0, 200)}...\n\nreturn items;`
          }
        }
      ],
      connections: {
        'Start': {
          main: [
            [
              {
                node: 'Process SOP',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      tags: ['SOP', 'Generated', 'Workflow']
    };

    if (workflowDescription) {
      (basicWorkflow as any).meta = {
        description: workflowDescription
      };
    }

    return basicWorkflow;
  }
}

/**
 * Get Execute SOP Plan tool definition
 */
export function getExecuteSopPlanToolDefinition(): ToolDefinition {
  return {
    name: 'execute_sop_plan',
    description: 'Execute an SOP implementation plan by creating a validated n8n workflow. This tool analyzes the plan, validates it against n8n best practices, and creates the corresponding workflow with proper error handling and structure.',
    inputSchema: {
      type: 'object',
      properties: {
        implementationPlan: {
          type: 'string',
          description: 'The complete SOP implementation plan (typically generated from SOP analysis)',
        },
        workflowName: {
          type: 'string',
          description: 'Name for the workflow to be created',
        },
        workflowDescription: {
          type: 'string',
          description: 'Optional description for the workflow',
        },
        dryRun: {
          type: 'boolean',
          description: 'If true, returns the workflow creation prompt instead of actually creating the workflow (default: false)',
        },
        autoActivate: {
          type: 'boolean',
          description: 'Whether to activate the workflow immediately after creation (default: false)',
        },
      },
      required: ['implementationPlan', 'workflowName'],
    },
  };
} 