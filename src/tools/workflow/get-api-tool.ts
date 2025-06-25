/**
 * Get API Tool
 * 
 * This tool retrieves workflows that are API-related from n8n using efficient API filters:
 * - Workflows from project Yogi (eLrt0vDtupnZfKuD) 
 * - Workflows tagged with "Tool", "API", or "Admin Tool"
 * Uses n8n API filtering instead of client-side filtering for better performance.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition, Workflow } from '../../types/index.js';

/**
 * Handler for the get_api_tool tool
 */
export class GetApiToolHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments (optional filters)
   * @returns List of API-related workflows
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      const projectYogiId = 'eLrt0vDtupnZfKuD';
      
      // Get limit and includeInactive from args
      const limit = args.limit || 1000;
      const includeInactive = args.includeInactive !== false; // Default to true
      
      try {
        console.log('Fetching API workflows using efficient API filters...');
        
        // Use a Map to deduplicate workflows by ID
        const uniqueWorkflows = new Map<string, Workflow & { matchReason: string }>();
        
        
        // 3. Get workflows tagged with "API"
        console.log('Fetching workflows tagged with "API"...');
        const apiResult = await this.apiService.getClient().getWorkflows({
          tags: 'API',
          active: includeInactive ? undefined : true,
          limit: Math.min(limit, 250),
          excludePinnedData: true
        });
        
        apiResult.data.forEach((workflow: any) => {
          const existing = uniqueWorkflows.get(workflow.id);
          if (existing) {
            existing.matchReason += ', Tag: API';
          } else {
            uniqueWorkflows.set(workflow.id, {
              ...workflow,
              matchReason: 'Tag: API'
            });
          }
        });
        
        console.log(`Found ${apiResult.data.length} workflows tagged with "API"`);
        
        // Convert Map to array and apply final limit
        const matchingWorkflows = Array.from(uniqueWorkflows.values()).slice(0, limit);
        
        console.log(`Total unique API workflows found: ${matchingWorkflows.length}`);
        
        // Format the workflows for display
        const formattedWorkflows = matchingWorkflows.map((workflow: any) => ({
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          updatedAt: workflow.updatedAt,
          matchReason: workflow.matchReason,
          tags: workflow.tags || [],
          projectId: workflow.projectId || 'N/A'
        }));
        
        return this.formatSuccess(
          formattedWorkflows,
          `Found ${formattedWorkflows.length} API-related workflow(s) using efficient API filtering`
        );
        
      } catch (error) {
        console.error('Error fetching API workflows:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return this.formatError(`Failed to fetch API workflows: ${errorMessage}`);
      }
    }, args);
  }


}

/**
 * Get tool definition for the get_api_tool tool
 * 
 * @returns Tool definition
 */
export function getGetApiToolDefinition(): ToolDefinition {
  return {
    name: 'get_api_tool',
    description: 'Efficiently retrieve API-related workflows from n8n using server-side filtering. Includes workflows from project Yogi and those tagged with "Tool", "API", or "Admin Tool". Uses n8n API filters for optimal performance.',
    inputSchema: {
      type: 'object',
      properties: {
        includeInactive: {
          type: 'boolean',
          description: 'Whether to include inactive workflows in the results (default: true)',
          default: true
        },
        limit: {
          type: 'number',
          description: 'Maximum number of unique workflows to return (default: 1000)',
          default: 1000,
          minimum: 1
        }
      },
      required: [],
    },
  };
} 