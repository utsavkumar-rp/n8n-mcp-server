/**
 * Create Workflow Tool
 * 
 * This tool creates a new workflow in n8n.
 */

import { BaseWorkflowToolHandler } from './base-handler.js';
import { ToolCallResult, ToolDefinition } from '../../types/index.js';
import { N8nApiError } from '../../errors/index.js';

/**
 * Handler for the create_workflow tool
 */
export class CreateWorkflowHandler extends BaseWorkflowToolHandler {
  /**
   * Execute the tool
   * 
   * @param args Tool arguments containing workflow details
   * @returns Created workflow information
   */
  async execute(args: Record<string, any>): Promise<ToolCallResult> {
    return this.handleExecution(async (args) => {
      const { name, nodes, connections, active, tags } = args;
      if (!name) {
        throw new N8nApiError('Missing required parameter: name');
      }
      
      // Validate nodes if provided
      if (nodes && !Array.isArray(nodes)) {
        throw new N8nApiError('Parameter "nodes" must be an array');
      }
      
      // Validate connections if provided
      if (connections && typeof connections !== 'object') {
        throw new N8nApiError('Parameter "connections" must be an object');
      }
      
      // Prepare workflow object
      const workflowData: Record<string, any> = {
        name,
        active: active === true,  // Default to false if not specified
      };
      
      // Add optional fields if provided
      if (nodes) workflowData.nodes = nodes;
      if (connections) workflowData.connections = connections;
      if (tags) workflowData.tags = tags;
      
      // Create the workflow
      const workflow = await this.apiService.createWorkflow(workflowData);
      
      return this.formatSuccess(
        {
          id: workflow.id,
          name: workflow.name,
          active: workflow.active
        },
        `Workflow created successfully`
      );
    }, args);
  }
}

/**
 * Get tool definition for the create_workflow tool
 * 
 * @returns Tool definition
 */
export function getCreateWorkflowToolDefinition(): ToolDefinition {
  return {
    name: 'create_workflow',
    description: 'Create a new workflow in n8n',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the workflow',
        },
        nodes: {
          type: 'array',
          description: 'Array of node objects that define the workflow',
          items: {
            type: 'object',
          },
        },
        connections: {
          type: 'object',
          description: 'Connection mappings between nodes',
        },
        active: {
          type: 'boolean',
          description: 'Whether the workflow should be active upon creation',
        },
        tags: {
          type: 'array',
          description: 'Tags to associate with the workflow',
          items: {
            type: 'string',
          },
        },
      },
      required: ['name'],
    },
  };
}
