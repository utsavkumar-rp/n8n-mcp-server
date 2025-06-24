/**
 * API Workflows Static Resource
 * 
 * This module provides a static resource for API workflows in n8n.
 */

import { N8nApiService } from '../../api/n8n-client.js';
import { Workflow } from '../../types/index.js';

/**
 * Get API workflows resource content
 * 
 * @param apiService n8n API service instance
 * @returns Formatted API workflows data as string
 */
export async function getApiWorkflowsResource(apiService: N8nApiService): Promise<string> {
  try {
    // Fetch API workflows from n8n
    const workflows = await apiService.getApiWorkflows();
    
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
      summary: `Found ${formattedWorkflows.length} API workflow(s)`,
      workflows: formattedWorkflows,
      timestamp: new Date().toISOString(),
    };
    
    return JSON.stringify(output, null, 2);
  } catch (error) {
    return JSON.stringify({
      error: 'Failed to fetch API workflows',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
}

/**
 * Get API workflows resource URI
 * 
 * @returns Resource URI for API workflows
 */
export function getApiWorkflowsResourceUri(): string {
  return 'n8n://api-workflows';
}

/**
 * Get API workflows resource metadata
 * 
 * @returns Resource metadata for API workflows
 */
export function getApiWorkflowsResourceMetadata(): Record<string, any> {
  return {
    uri: getApiWorkflowsResourceUri(),
    name: 'API Workflows',
    description: 'List of workflows tagged with "API" in n8n',
    mimeType: 'application/json',
  };
} 