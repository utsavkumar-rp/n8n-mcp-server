/**
 * Get API Tool
 * 
 * This tool retrieves workflows that are API-related from n8n using efficient API filters:
 * - Workflows tagged with "API"
 * Uses intelligent query detection to provide appropriate responses for different use cases:
 * Returns first 10 API tools, more API workflows can be fetched by using pagination
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
   * @param args Tool arguments (optional filters and query parameters)
   * @returns List of API-related workflows based on query type
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async () => {
      
      // Get parameters from args
      const includeInactive = args.includeInactive !== false; 
      const limit = 10;
      const cursor = args.cursor || undefined;
      
      try {
        console.log(`Handling list query for API tools`);
    
        // Get workflows tagged with "API" with limit
        const apiResult = await this.apiService.getClient().getWorkflows({
          tags: 'API',
          active: includeInactive ? undefined : true,
          limit: limit,
          excludePinnedData: true,
          cursor: cursor
        });
        
        const formattedWorkflows = apiResult.data.slice(0, limit).map((workflow: any) => ({
          id: workflow.id,
          name: workflow.name,
          active: workflow.active,
          updatedAt: workflow.updatedAt,
          matchReason: 'Tag: API',
          tags: workflow.tags || [],
          projectId: workflow.projectId || 'N/A'
        }));

        const response = {
          workflows: formattedWorkflows,
          nextCursor: apiResult.nextCursor || undefined,
          hasMore: apiResult.nextCursor !== undefined,
        }
        
        return this.formatSuccess(
          response,
          `Found ${formattedWorkflows.length} API tool workflow(s)`
        );
      } catch (error) {
        console.error('Error fetching API workflows:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return this.formatError(`Failed to fetch API workflows: ${errorMessage}`);
      }
    }, args);
  }

  /**
   * Fetch all API workflows using pagination
   */
  private async fetchAllApiWorkflows(includeInactive: boolean): Promise<Array<Workflow & { matchReason: string }>> {
    console.log('Fetching all API workflows using pagination...');
    
    const uniqueWorkflows = new Map<string, Workflow & { matchReason: string }>();
    const pageSize = 10; // Maximum allowed by n8n API
    let cursor: string | undefined;
    let hasMore = true;
    
    // Fetch all workflows tagged with "API" using pagination
    while (hasMore) {
      const apiResult = await this.apiService.getClient().getWorkflows({
        tags: 'API',
        active: includeInactive ? undefined : true,
        limit: pageSize,
        cursor,
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
      
      console.log(`Fetched ${apiResult.data.length} workflows in this batch`);
      
             // Check if there are more results
       cursor = apiResult.nextCursor || undefined;
       hasMore = !!cursor;
    }
    
    const totalWorkflows = Array.from(uniqueWorkflows.values());
    console.log(`Total unique API workflows found: ${totalWorkflows.length}`);
    
    return totalWorkflows;
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
    description: 'Retrieve API-related workflows from n8n (workflows tagged with "API"). Supports pagination to fetch additional results.',
    inputSchema: {
      type: 'object',
      properties: {
        includeInactive: {
          type: 'boolean',
          description: 'Whether to include inactive workflows in the results (default: true)',
          default: true
        },
        cursor: {
          type: 'string',
          description: 'Pagination cursor from previous response to get next page of results'
        }
      },
      required: [],
    },
  };
} 