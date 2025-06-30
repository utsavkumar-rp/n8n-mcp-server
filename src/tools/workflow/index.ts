/**
 * Workflow Tools Module
 * 
 * This module provides MCP tools for interacting with n8n workflows.
 */

import { ToolDefinition } from '../../types/index.js';

// Import tool definitions
import { getListWorkflowsToolDefinition, ListWorkflowsHandler } from './list.js';
import { getGetWorkflowToolDefinition, GetWorkflowHandler } from './get.js';
import { getCreateWorkflowToolDefinition, CreateWorkflowHandler } from './create.js';
import { getUpdateWorkflowToolDefinition, UpdateWorkflowHandler } from './update.js';
import { getDeleteWorkflowToolDefinition, DeleteWorkflowHandler } from './delete.js';
import { getActivateWorkflowToolDefinition, ActivateWorkflowHandler } from './activate.js';
import { getDeactivateWorkflowToolDefinition, DeactivateWorkflowHandler } from './deactivate.js';
import { getGetApiToolDefinition, GetApiToolHandler } from './get-api-tool.js';
import { getSopPlanGeneratorToolDefinition, SopPlanGeneratorTool } from './sop-plan-generator.js';
import { getExecuteSopPlanToolDefinition, ExecuteSopPlanHandler } from './execute-sop-plan.js';

// Export handlers
export {
  ListWorkflowsHandler,
  GetWorkflowHandler,
  CreateWorkflowHandler,
  UpdateWorkflowHandler,
  DeleteWorkflowHandler,
  ActivateWorkflowHandler,
  DeactivateWorkflowHandler,
  GetApiToolHandler,
  SopPlanGeneratorTool,
  ExecuteSopPlanHandler,
};

/**
 * Set up workflow management tools
 * 
 * @returns Array of workflow tool definitions
 */
export async function setupWorkflowTools(): Promise<ToolDefinition[]> {
  return [
    getListWorkflowsToolDefinition(),
    getGetWorkflowToolDefinition(),
    getCreateWorkflowToolDefinition(),
    getUpdateWorkflowToolDefinition(),
    getDeleteWorkflowToolDefinition(),
    getActivateWorkflowToolDefinition(),
    getDeactivateWorkflowToolDefinition(),
    getGetApiToolDefinition(),
    getSopPlanGeneratorToolDefinition(),
    getExecuteSopPlanToolDefinition(),
  ];
}
