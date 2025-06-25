/**
 * Get API Tool Tests
 * 
 * Unit tests for the get_api_tool workflow handler
 */

import { GetApiToolHandler, getGetApiToolDefinition } from '../../../../src/tools/workflow/get-api-tool.js';

describe('GetApiToolHandler', () => {
  let handler: GetApiToolHandler;

  beforeEach(() => {
    // Set required environment variables for testing
    process.env.N8N_API_URL = 'http://localhost:5678/api/v1';
    process.env.N8N_API_KEY = 'test-api-key';
    
    handler = new GetApiToolHandler();
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.N8N_API_URL;
    delete process.env.N8N_API_KEY;
  });

  describe('getGetApiToolDefinition', () => {
    it('should return correct tool definition', () => {
      const definition = getGetApiToolDefinition();
      
      expect(definition.name).toBe('get_api_tool');
      expect(definition.description).toContain('API-related');
      expect(definition.description).toContain('project Yogi');
      expect(definition.description).toContain('tools folder');
      expect(definition.description).toContain('Tool or Admin API Tool');
      expect(definition.inputSchema.type).toBe('object');
      expect(definition.inputSchema.properties).toHaveProperty('includeInactive');
      expect(definition.inputSchema.properties).toHaveProperty('limit');
    });
  });

  describe('execute', () => {
    it('should have execute method', () => {
      expect(handler.execute).toBeDefined();
      expect(typeof handler.execute).toBe('function');
    });

    // Note: More comprehensive tests would require mocking the API service
    // and setting up test data, which would follow the same patterns as
    // other workflow tool tests in this project
  });
}); 