/**
 * List Workflows Tool
 * 
 * This tool retrieves a list of workflows from n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';

/**
 * Handler for the list_workflows tool
 */
export class ListWorkflowsHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments with optional query parameters
   * @returns List of workflows with pagination info
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      // Build query parameters from args
      const queryParams: any = {
        limit: 10,
      };
      
      if (args.active !== undefined) {
        queryParams.active = args.active;
      }
      if (args.tags) {
        queryParams.tags = args.tags;
      }
      if (args.name) {
        queryParams.name = args.name;
      }
      if (args.projectId) {
        queryParams.projectId = args.projectId;
      }
      if (args.excludePinnedData !== undefined) {
        queryParams.excludePinnedData = args.excludePinnedData;
      }
      if (args.limit !== undefined) {
        queryParams.limit = args.limit;
      }
      if (args.cursor) {
        queryParams.cursor = args.cursor;
      }
      
      // Get workflows with pagination using the new API
      const result = await this.apiService.getClient().getWorkflows(queryParams);
      
      // Format the workflows for display
      const formattedWorkflows = result.data.map((workflow: Workflow) => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active,
        updatedAt: workflow.updatedAt,
        tags: workflow.tags || [],
        projectId: workflow.projectId || null,
      }));
      
      // Prepare response with pagination info
      const responseData = {
        workflows: formattedWorkflows,
        count: formattedWorkflows.length,
        nextCursor: result.nextCursor,
        hasMore: result.nextCursor !== null
      };
      
      const message = `Found ${formattedWorkflows.length} workflow(s)${result.nextCursor ? ' (more available)' : ''}`;
      
      return this.formatSuccess(responseData, message);
    }, args);
  }
}

/**
 * Get tool definition for the list_workflows tool
 * 
 * @returns Tool definition
 */
export function getListWorkflowsToolDefinition(): ToolDefinition {
  return {
    name: 'list_workflows',
    description: 'Retrieve a list of workflows from n8n with optional filtering and pagination support',
    inputSchema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
          description: 'Filter workflows by active status (true for active, false for inactive)',
        },
        tags: {
          type: 'string',
          description: 'Filter workflows by tags (comma-separated, e.g., "production,api")',
        },
        name: {
          type: 'string',
          description: 'Filter workflows by name (partial matching)',
        },
        projectId: {
          type: 'string',
          description: 'Filter workflows by project ID',
        },
        excludePinnedData: {
          type: 'boolean',
          description: 'Exclude pinned data from workflow results to reduce response size',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of workflows to return (1-250, default: 100)',
          minimum: 1,
          maximum: 250,
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor from previous response to get next page of results',
        },
      },
      required: [],
    },
  };
}
