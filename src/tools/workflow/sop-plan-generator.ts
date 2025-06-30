/**
 * SOP Plan Generator Tool
 * 
 * This module takes SOP text as input, performs comprehensive analysis using MCP tools,
 * and returns a complete implementation plan for n8n workflow conversion.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';

/**
 * Embedded SOP Analysis Prompt Content
 */
const SOP_ANALYSIS_PROMPT = `# Intelligent n8n SOP Analysis

## Core Directive
You are an expert n8n workflow analyst tasked with analyzing Standard Operating Procedures (SOPs) and understanding their requirements in the context of existing n8n capabilities. Use ALL available MCP tools to systematically discover and analyze the current n8n environment.

## Phase 1: Environment Discovery

### 1.1 Workflow Inventory Analysis
Execute these MCP tools in parallel to understand the current environment:

\`\`\`
mcp_n8n-local_list_workflows(active=true)
mcp_n8n-local_list_workflows(active=false)
\`\`\`

### 1.2 API Tool Discovery & Analysis
Execute comprehensive API tool analysis with pagination:

\`\`\`
mcp_n8n-local_get_api_tool(includeInactive=true)
\`\`\`

**If pagination cursor is returned, continue fetching:**
\`\`\`
mcp_n8n-local_get_api_tool(cursor="<cursor_from_previous_response>", includeInactive=true)
\`\`\`

**Repeat until all API tools are discovered.**

### 1.3 Detailed Workflow Pattern Analysis
For each workflow identified (both regular and API workflows), execute:
\`\`\`
mcp_n8n-local_get_workflow(workflowId="<id>")
\`\`\`

Focus on understanding:
- **Decision Tree Patterns**: How conditional logic is structured
- **Data Flow Architecture**: How information flows between nodes
- **Validation Chains**: Sequential checks and error handling
- **Routing Logic**: How requests are routed to different teams
- **Response Generation**: How dynamic responses are built
- **API Integration Patterns**: How external APIs are called and data is processed
- **Authentication Mechanisms**: How API credentials and authentication are handled
- **Error Handling**: How API failures and exceptions are managed
- **Data Transformation**: How API responses are parsed and transformed

## Phase 2: SOP Content Analysis

### 2.1 Business Process Understanding
Analyze the provided SOP to identify:

**Process Structure:**
- All decision points and conditions
- Sequential steps and parallel processes
- Validation requirements and business rules
- Data dependencies and information flow

**Stakeholders:**
- All actors (users, systems, teams) involved
- Their roles and responsibilities
- Interaction points and handoff procedures

**Data Flow:**
- All data inputs needed
- Data sources and validation rules
- Data transformations required
- Output formats and destinations

### 2.2 Business Rules Identification
Extract and categorize:
- **Conditional Logic**: All if-then-else scenarios
- **Validation Rules**: Data quality and business constraints
- **Escalation Criteria**: Routing and escalation paths
- **Exception Handling**: Error scenarios and recovery procedures

## Phase 3: Capability Mapping

### 3.1 Current Capability Assessment
Based on comprehensive workflow and API analysis, document:

**Available Workflow Capabilities:**
- List all executeWorkflow nodes and their functions
- Document decision-making patterns and conditional logic
- Identify routing and notification mechanisms
- Map response generation patterns

**Available API Capabilities:**
- Catalog all API-tagged workflows and their functions
- Document API endpoint mappings and data retrieval patterns
- Map authentication and authorization mechanisms
- Identify data transformation and validation patterns
- Document error handling and retry mechanisms
- Catalog API response formats and data structures

**Integration Patterns:**
- Document webhook endpoints and trigger mechanisms
- Map data flow patterns between workflows
- Identify reusable workflow components
- Document API chaining and orchestration patterns

**SOP Requirements Mapping:**
- Map SOP decision points to existing workflow logic patterns
- Identify data sources and API endpoints needed
- Determine integration requirements and data dependencies
- Specify business logic requirements and validation rules
- Map stakeholder interactions to existing notification/routing patterns

## Output Format

Provide a structured analysis:

### Executive Summary
- SOP complexity assessment (LOW/MEDIUM/HIGH)
- Key business processes identified
- Data and integration requirements overview

### Process Analysis
- Business process breakdown
- Decision points and logic flows
- Data requirements and sources
- Stakeholder interactions

### Current Capability Assessment
- Available n8n workflows and their relevance
- Existing API-tagged workflows and their capabilities
- Existing patterns that could be leveraged (decision trees, routing, validation)
- Current API endpoints and data retrieval capabilities
- Authentication and integration patterns available
- Data transformation and error handling mechanisms

### Requirements Summary
- Data sources needed
- Integration requirements
- Business logic requirements
- Routing and notification needs

## Quality Standards

**Verification Requirements:**
- All claims about existing capabilities verified through MCP tool analysis
- All workflow references validated against actual n8n environment
- No assumptions about API availability without verification

**Completeness Criteria:**
- All SOP decision points identified and categorized
- All data requirements documented
- All stakeholders and their roles mapped
- All process flows understood and documented

Use this framework to thoroughly analyze any SOP and understand its requirements in the context of the current n8n environment.`;

/**
 * SOP Plan Generator Tool Handler
 */
export class SopPlanGeneratorTool extends BaseWorkflowToolHandler {
  /**
   * Execute SOP plan generation by creating a combined prompt with embedded SOP
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    try {
      const { sopText, sopTitle = 'SOP Analysis' } = args;

      if (!sopText || typeof sopText !== 'string') {
        throw new Error('sopText is required and must be a string');
      }

      const combinedPrompt = this.createCombinedPrompt(sopText.trim(), sopTitle.trim());
      
      return this.formatSuccess(
        { 
          sopPlanPrompt: combinedPrompt,
          promptLength: combinedPrompt.length,
          sopTitle,
          usage: "Copy the 'sopPlanPrompt' and paste it to an AI with MCP tools to generate the implementation plan"
        }, 
        `✅ Generated SOP analysis prompt for "${sopTitle}" (${combinedPrompt.length} characters)`
      );
    } catch (error) {
      return this.formatError(error instanceof Error ? error : new Error('Failed to generate combined prompt'));
    }
  }

  /**
   * Create combined prompt by embedding SOP within the analysis framework
   */
  private createCombinedPrompt(sopText: string, sopTitle: string): string {
    return `${SOP_ANALYSIS_PROMPT}

---

## SOP TO ANALYZE

**Title:** ${sopTitle}

**SOP Content:**
${sopText}`;
  }
}

/**
 * Get SOP Plan Generator tool definition
 */
export function getSopPlanGeneratorToolDefinition(): ToolDefinition {
  return {
    name: 'generate_sop_plan_prompt',
    description: 'Generate a comprehensive analysis prompt for SOP conversion to n8n workflow. Takes SOP text, embeds it within the sop-analysis framework, and returns a complete prompt that can be copied and executed by AI with MCP tools to generate the actual implementation plan.',
    inputSchema: {
      type: 'object',
      properties: {
        sopText: {
          type: 'string',
          description: 'The SOP text to embed within the analysis framework',
        },
        sopTitle: {
          type: 'string',
          description: 'Title/name for the SOP (optional, defaults to "SOP Analysis")',
        },
      },
      required: ['sopText'],
    },
  };
} 