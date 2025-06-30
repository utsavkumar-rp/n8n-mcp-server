#!/usr/bin/env node

/**
 * Example: Accessing SOP Generation Guide Resource via MCP
 */

import { getSopGenerationGuideResource, getSopGenerationGuideResourceUri } from './build/resources/static/sop-generation-guide.js';

async function demonstrateMCPResourceAccess() {
  console.log('🔗 MCP Resource Access Demo\n');
  
  // Method 1: Get the resource URI
  const resourceUri = getSopGenerationGuideResourceUri();
  console.log('📍 Resource URI:', resourceUri);
  
  // Method 2: Get the actual resource content
  const resourceContent = await getSopGenerationGuideResource();
  console.log('\n📄 Resource Content Preview:');
  
  // Parse the JSON content
  const parsedContent = JSON.parse(resourceContent);
  console.log('Title:', parsedContent.title);
  console.log('Version:', parsedContent.version);
  console.log('Description:', parsedContent.description);
  
  // Show first few lines of the guide
  const guideText = parsedContent.content;
  const firstParagraph = guideText.split('\n\n')[0];
  console.log('\n📖 Guide Preview:');
  console.log(firstParagraph);
  
  console.log('\n💡 Usage in MCP Client:');
  console.log('1. Use URI:', resourceUri);
  console.log('2. In Claude: "Access resource://sop-generation-guide and use it to analyze my SOP"');
  console.log('3. In API calls: Include resourceUri in context');
}

// Example: Using the resource to analyze an SOP
async function analyzeSopWithGuide(sopText) {
  console.log('\n🔍 SOP Analysis Example\n');
  
  const guide = await getSopGenerationGuideResource();
  const parsedGuide = JSON.parse(guide);
  
  console.log('✅ SOP Generation Guide Loaded');
  console.log('✅ Ready to analyze SOP using guide framework');
  
  // In a real implementation, you would:
  // 1. Extract decision points from SOP
  // 2. Map to n8n node patterns from guide
  // 3. Generate workflow structure
  // 4. Apply validation rules from guide
  
  console.log('\n📋 Analysis Framework Applied:');
  console.log('• Input Layer: webhook + manualTrigger + set variables');
  console.log('• Data Layer: executeWorkflow nodes for API calls');
  console.log('• Logic Layer: if/switch nodes for decision trees');
  console.log('• Response Layer: structured response objects');
  console.log('• Routing Layer: Route to Group workflow calls');
  
  return {
    guideApplied: true,
    recommendedNodes: ['webhook', 'manualTrigger', 'set', 'executeWorkflow', 'if', 'switch'],
    resourceUri: getSopGenerationGuideResourceUri()
  };
}

// Run the demonstration
await demonstrateMCPResourceAccess();

// Example SOP for analysis
const exampleSop = `
Merchant Activation Status SOP
Step 1: Check activation_status
If under_review → Route to BSO
If rejected → Send rejection message
If activated → Check live status
`;

await analyzeSopWithGuide(exampleSop); 