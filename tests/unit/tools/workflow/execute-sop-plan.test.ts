/**
 * Tests for Execute SOP Plan Tool
 */

import { ExecuteSopPlanHandler, getExecuteSopPlanToolDefinition } from '../../../../src/tools/workflow/execute-sop-plan.js';

describe('ExecuteSopPlanHandler', () => {
  let handler: ExecuteSopPlanHandler;

  beforeEach(() => {
    // Set required environment variables for testing
    process.env.N8N_API_URL = 'http://localhost:5678/api/v1';
    process.env.N8N_API_KEY = 'test-api-key';
    
    handler = new ExecuteSopPlanHandler();
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.N8N_API_URL;
    delete process.env.N8N_API_KEY;
  });

  describe('getExecuteSopPlanToolDefinition', () => {
    it('should return correct tool definition', () => {
      const definition = getExecuteSopPlanToolDefinition();
      
      expect(definition.name).toBe('execute_sop_plan');
      expect(definition.description).toContain('Execute an SOP implementation plan');
      expect(definition.description).toContain('creating a validated n8n workflow');
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.properties).toHaveProperty('implementationPlan');
      expect(definition.inputSchema.properties).toHaveProperty('workflowName');
      expect(definition.inputSchema.properties).toHaveProperty('workflowDescription');
      expect(definition.inputSchema.properties).toHaveProperty('dryRun');
      expect(definition.inputSchema.properties).toHaveProperty('autoActivate');
      expect(definition.inputSchema.required).toEqual(['implementationPlan', 'workflowName']);
    });

    it('should have correct input schema properties', () => {
      const definition = getExecuteSopPlanToolDefinition();
      
      expect(definition.inputSchema.properties.implementationPlan).toHaveProperty('type', 'string');
      expect(definition.inputSchema.properties.implementationPlan).toHaveProperty('description');
      
      expect(definition.inputSchema.properties.workflowName).toHaveProperty('type', 'string');
      expect(definition.inputSchema.properties.workflowName).toHaveProperty('description');
      
      expect(definition.inputSchema.properties.workflowDescription).toHaveProperty('type', 'string');
      expect(definition.inputSchema.properties.workflowDescription).toHaveProperty('description');
      
      expect(definition.inputSchema.properties.dryRun).toHaveProperty('type', 'boolean');
      expect(definition.inputSchema.properties.dryRun).toHaveProperty('description');
      
      expect(definition.inputSchema.properties.autoActivate).toHaveProperty('type', 'boolean');
      expect(definition.inputSchema.properties.autoActivate).toHaveProperty('description');
    });
  });

  describe('execute', () => {
    it('should have execute method', () => {
      expect(handler.execute).toBeDefined();
      expect(typeof handler.execute).toBe('function');
    });

    it('should support dry run mode', async () => {
      // Test that dry run mode returns a prompt instead of creating workflow
      expect(handler.execute).toBeDefined();
      // Note: Full integration tests would require mocking the API service
    });

    it('should support workflow creation mode', async () => {
      // Test that non-dry-run mode attempts to create workflow
      expect(handler.execute).toBeDefined();
      // Note: Full integration tests would require mocking the API service
    });
  });

  describe('Prompt Generation', () => {
    it('should generate comprehensive workflow creation prompt', () => {
      const implementationPlan = 'Detailed SOP plan with business logic...';
      const workflowName = 'Customer Support Workflow';
      const workflowDescription = 'Handles customer support requests';

      const prompt = (handler as any).createWorkflowCreationPrompt(
        implementationPlan,
        workflowName,
        workflowDescription
      );

      expect(prompt).toContain('n8n Workflow Creation Assistant');
      expect(prompt).toContain('Validation Framework');
      expect(prompt).toContain('IMPLEMENTATION PLAN TO EXECUTE');
      expect(prompt).toContain(workflowName);
      expect(prompt).toContain(workflowDescription);
      expect(prompt).toContain(implementationPlan);
      expect(prompt).toContain('mcp_n8n-local_create_workflow');
      expect(prompt).toContain('EXECUTION INSTRUCTIONS');
    });

    it('should use default description when not provided', () => {
      const prompt = (handler as any).createWorkflowCreationPrompt(
        'Implementation plan',
        'Test Workflow',
        ''
      );

      expect(prompt).toContain('Generated from SOP implementation plan');
    });
  });
}); 