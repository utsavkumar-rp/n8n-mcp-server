# Get API Tool

## Overview

The `get_api_tool` is a workflow tool that retrieves API-related workflows from your n8n instance. This tool efficiently fetches workflows tagged with "API" and supports pagination for browsing through results.

The tool returns workflows that are tagged with "API" along with pagination support for handling large result sets.

## Functionality

The tool searches for workflows that match the following criteria:
- **Tag: API**: Workflows tagged with "API"

## Usage Examples

### Basic Usage
```javascript
// Get first 10 API tools (default behavior)
const result = await getApiTool();

// Response format:
{
  "workflows": [
    {
      "id": "123",
      "name": "EMI Duration API",
      "active": true,
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "matchReason": "Tag: API",
      "tags": ["API", "EMI"],
      "projectId": "eLrt0vDtupnZfKuD"
    }
    // ... up to 10 workflows
  ],
  "nextCursor": "cursor-string-here",
  "hasMore": true
}
```

### Pagination
```javascript
// Get next page of results using cursor
const result = await getApiTool({ 
  cursor: "previous-cursor-string"
});
```

### Include/Exclude Inactive Workflows
```javascript
// Only get active workflows
const result = await getApiTool({ 
  includeInactive: false
});

// Include both active and inactive (default)
const result = await getApiTool({ 
  includeInactive: true
});
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeInactive` | boolean | `true` | Whether to include inactive workflows in results |
| `cursor` | string | `undefined` | Pagination cursor from previous response |

## Response Format

The tool returns an object with the following structure:

```json
{
  "workflows": [
    {
      "id": "workflow-id",
      "name": "Workflow Name", 
      "active": true,
      "updatedAt": "2024-01-15T10:30:00Z",
      "matchReason": "Tag: API",
      "tags": ["API", "Tool"],
      "projectId": "project-id-or-N/A"
    }
  ],
  "nextCursor": "cursor-for-next-page",
  "hasMore": true
}
```

### Response Fields

- **workflows**: Array of workflow objects matching the API criteria
- **nextCursor**: Cursor string to use for fetching the next page (undefined if no more results)
- **hasMore**: Boolean indicating whether there are more results available

### Workflow Object Fields

- **id**: Unique workflow identifier
- **name**: Workflow name
- **active**: Whether the workflow is currently active
- **updatedAt**: Last update timestamp
- **matchReason**: Always "Tag: API" (indicates why this workflow was included)
- **tags**: Array of tags associated with the workflow
- **projectId**: Project ID the workflow belongs to (or "N/A" if not set)

## Pagination

The tool supports cursor-based pagination:

1. **First request**: Call without a cursor to get the first page
2. **Subsequent requests**: Use the `nextCursor` from the previous response
3. **End of results**: When `hasMore` is `false` or `nextCursor` is undefined

```javascript
let cursor = undefined;
let allWorkflows = [];

do {
  const result = await getApiTool({ cursor });
  allWorkflows.push(...result.workflows);
  cursor = result.nextCursor;
} while (result.hasMore);

console.log(`Total API workflows found: ${allWorkflows.length}`);
```

## Use Cases

### Browse API Tools
```javascript
// Quick overview of API tools
const result = await getApiTool();
console.log(`Found ${result.workflows.length} API tools`);
result.workflows.forEach(workflow => {
  console.log(`- ${workflow.name} (${workflow.active ? 'Active' : 'Inactive'})`);
});
```

### Get All API Tools
```javascript
// Fetch all API tools using pagination
async function getAllApiTools() {
  let allWorkflows = [];
  let cursor = undefined;
  
  do {
    const result = await getApiTool({ cursor });
    allWorkflows.push(...result.workflows);
    cursor = result.nextCursor;
  } while (result.hasMore);
  
  return allWorkflows;
}
```

### Filter Active API Tools
```javascript
// Get only active API workflows
const result = await getApiTool({ includeInactive: false });
console.log(`Active API tools: ${result.workflows.length}`);
```

## Error Handling

The tool handles errors gracefully:
- Invalid parameters are handled with appropriate defaults
- API connection errors are caught and reported clearly
- Pagination errors don't stop the entire operation
- Missing or invalid cursors are handled safely

## Performance Notes

- **Default limit**: Returns 10 workflows by default for quick responses
- **Pagination**: Uses cursor-based pagination for efficient browsing
- **Filtered queries**: Only fetches workflows tagged with "API" to reduce response size
- **Pinned data exclusion**: Excludes pinned data to improve response times

## Related Tools

- `list_workflows`: Lists all workflows without filtering
- `get_workflow`: Retrieves a specific workflow by ID
- Workflow management tools: `create_workflow`, `update_workflow`, `delete_workflow`
- `activate_workflow`, `deactivate_workflow`: Manage workflow active status 