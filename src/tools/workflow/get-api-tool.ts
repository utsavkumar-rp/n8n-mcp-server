/**
 * Get API Tool
 * 
 * This tool retrieves workflows that are API-related from n8n based on specific criteria:
 * - Workflows under project Yogi (eLrt0vDtupnZfKuD)
 * - Workflows in the tools folder (aqy20HQpJ9m7DIFH)  
 * - Workflows with tags "Tool" or "Admin API Tool"
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
      const toolsFolderId = 'aqy20HQpJ9m7DIFH';
      const targetTags = ['Tool', 'Admin API Tool'];
      
      // OPTIMIZED: Single API call to get all workflows, then filter client-side
      try {
        console.log('Fetching all workflows with single API call...');
        const allWorkflows = await this.apiService.getWorkflows();
        console.log(`Retrieved ${allWorkflows.length} total workflows`);
        
        // Filter workflows that match ANY of our criteria (OR logic)
        const matchingWorkflows: Array<Workflow & { matchReason: string }> = allWorkflows
          .map((workflow: any) => {
            const matchReasons: string[] = [];
            
            // Check if workflow matches Project Yogi
            if (workflow.projectId === projectYogiId) {
              matchReasons.push('Project Yogi');
            }
            
            // Check if workflow has target tags
            if (workflow.tags && Array.isArray(workflow.tags)) {
              targetTags.forEach(targetTag => {
                if (workflow.tags.some((tag: any) => 
                  (typeof tag === 'string' && tag === targetTag) ||
                  (typeof tag === 'object' && tag.name === targetTag)
                )) {
                  matchReasons.push(`Tag: ${targetTag}`);
                }
              });
            }
            
            // Check if workflow is in tools folder
            if (this.isInToolsFolder(workflow, toolsFolderId)) {
              matchReasons.push('Tools Folder');
            }
            
            // Return workflow with match reasons if any criteria matched
            if (matchReasons.length > 0) {
              return {
                ...workflow,
                matchReason: matchReasons.join(', ')
              };
            }
            
            return null;
          })
          .filter((workflow): workflow is Workflow & { matchReason: string } => workflow !== null);
        
        console.log(`Found ${matchingWorkflows.length} workflows matching API criteria`);
        
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
          `Found ${formattedWorkflows.length} API-related workflow(s)`
        );
        
      } catch (error) {
        console.error('Error fetching workflows:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return this.formatError(`Failed to fetch workflows: ${errorMessage}`);
      }
    }, args);
  }



  /**
   * Check if a workflow is in the tools folder
   * 
   * @param workflow Workflow object
   * @param toolsFolderId Tools folder ID
   * @returns boolean indicating if workflow is in tools folder
   */
  private isInToolsFolder(workflow: any, toolsFolderId: string): boolean {
    // Check various possible locations where folder information might be stored
    // This is based on common patterns in workflow management systems
    
    // Check if workflow has a folderId property
    if (workflow.folderId === toolsFolderId) {
      return true;
    }
    
    // Check in settings
    if (workflow.settings?.folderId === toolsFolderId) {
      return true;
    }
    
    // Check in meta data
    if (workflow.meta?.folderId === toolsFolderId) {
      return true;
    }
    
    // Check if folder information is in tags or other metadata
    if (workflow.tags?.some((tag: any) => 
      typeof tag === 'object' && tag.folderId === toolsFolderId
    )) {
      return true;
    }
    
    // Check if workflow name or other properties indicate it's in tools folder
    // This is a fallback check based on naming conventions
    const workflowName = workflow.name?.toLowerCase() || '';
    const isToolRelated = workflowName.includes('tool') || 
                         workflowName.includes('api') ||
                         workflowName.includes('utility');
    
    return isToolRelated;
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
    description: 'Retrieve workflows that are API-related from n8n. This includes workflows from project Yogi, the tools folder, and those tagged as Tool or Admin API Tool.',
    inputSchema: {
      type: 'object',
      properties: {
        includeInactive: {
          type: 'boolean',
          description: 'Whether to include inactive workflows in the results',
          default: true
        },
        limit: {
          type: 'number',
          description: 'Maximum number of workflows to return',
          default: 100
        }
      },
      required: [],
    },
  };
} 