/**
 * List API Workflows Tool
 * 
 * This tool retrieves a list of workflows tagged with 'API' from n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';

/**
 * Handler for the list_api_workflows tool
 */
export class ListApiWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments
   * @returns List of API workflows
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const workflows = await this.apiService.getApiWorkflows();
      
      // Format the workflows for display
      const formattedWorkflows = workflows.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        updatedAt: workflow.updatedAt,
      }));
      
      return this.formatSuccess(
        formattedWorkflows,
        `Found ${formattedWorkflows.length} API workflow(s)`
      );
    }, args);
  }
}

/**
 * Get tool definition for the list_api_workflows tool
 * 
 * @returns Tool definition
 */
export function getListApiWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'list_api_workflows',
    description: 'Retrieve a list of workflows tagged with "API" from n8n',
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