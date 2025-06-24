/**
 * List Tool Workflows Tool
 * 
 * This tool retrieves a list of workflows tagged with 'tool' from n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';

/**
 * Handler for the list_tool_workflows tool
 */
export class ListToolWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of tool workflows
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const workflows = await this.apiService.getToolWorkflows();
      
      // Format the workflows for display
      const formattedWorkflows = workflows.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        updatedAt: workflow.updatedAt,
      }));
      
      return this.formatSuccess(
        formattedWorkflows,
        `Found ${formattedWorkflows.length} tool workflow(s)`
      );
    }, args);
  }
}

/**
 * Get tool definition for the list_tool_workflows tool
 * 
 * @returns Tool definition
 */
export function getListToolWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'list_tool_workflows',
    description: 'Retrieve a list of workflows tagged with "tool" from n8n',
    inputSchema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Optional filter to show only active or inactive workflows',
        },
      },
      required: [],
    },
  };
} 