/**
 * Tool Workflows Static Resource
 * 
 * This module provides a static resource for tool workflows in n8n.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { Workflow } from '../../types/index.js';

/**
 * Get tool workflows resource content
 * 
 * @param apiService n8n API service instance
 * @returns Formatted tool workflows data as string
 */
export async function getToolWorkflowsResource(apiService: N8nApiService): Promise<string> {
  try {
    // Fetch tool workflows from n8n
    const workflows = await apiService.getToolWorkflows();
    
    // Format workflows for display
    const formattedWorkflows = workflows.map((workflow: Workflow) => ({
      id: workflow.id,
      name: workflow.name,
      active: workflow.active,
      updatedAt: workflow.updatedAt,
      tags: workflow.tags || [],
    }));
    
    // Create formatted output
    const output = {
      summary: `Found ${formattedWorkflows.length} tool workflow(s)`,
      workflows: formattedWorkflows,
      timestamp: new Date().toISOString(),
    };
    
    return JSON.stringify(output, null, 2);
  } catch (error) {
    return JSON.stringify({
      error: 'Failed to fetch tool workflows',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
}

/**
 * Get tool workflows resource URI
 * 
 * @returns Resource URI for tool workflows
 */
export function getToolWorkflowsResourceUri(): string {
  return 'n8n://tool-workflows';
}

/**
 * Get tool workflows resource metadata
 * 
 * @returns Resource metadata for tool workflows
 */
export function getToolWorkflowsResourceMetadata(): Record<string, any> {
  return {
    uri: getToolWorkflowsResourceUri(),
    name: 'Tool Workflows',
    description: 'List of workflows tagged with "tool" in n8n',
    mimeType: 'application/json',
  };
} 