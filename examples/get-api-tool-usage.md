# Get API Tool Usage Examples

This document shows how to use the `get_api_tool` functionality to retrieve API-related workflows from n8n.

## Overview

The `get_api_tool` efficiently retrieves workflows that are tagged with "API" from your n8n instance. It supports pagination and filtering options to help you find the API workflows you need.

## Basic Usage

The tool returns workflows that are tagged with "API" in n8n, with customizable limits and pagination support.

### Simple Query - "Show me our API tools"

When you ask for API tools, the system returns API workflows:

### MCP Function Call:
```javascript
{
  "name": "get_api_tool",
  "arguments": {}
}
```

### Response:
```json
{
  "workflows": [
    {
      "id": "wf_123",
      "name": "EMI Duration Calculator API",
      "active": true,
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "matchReason": "Tag: API",
      "tags": ["API", "EMI", "Calculator"],
      "projectId": "eLrt0vDtupnZfKuD"
    },
    {
      "id": "wf_456",
      "name": "Merchant Validation Tool",
      "active": true,
      "updatedAt": "2024-01-14T09:15:00.000Z",
      "matchReason": "Tag: API",
      "tags": ["Tool", "Merchant", "Validation", "API"],
      "projectId": "eLrt0vDtupnZfKuD"
    }
  ],
  "nextCursor": "cursor_abc123",
  "hasMore": true
}
```

## Available Parameters

### includeInactive
Control whether to include inactive workflows in the results.

```javascript
{
  "name": "get_api_tool",
  "arguments": {
    "includeInactive": false  // Only show active workflows
  }
}
```



### cursor
Use pagination cursor to get the next set of results.

```javascript
{
  "name": "get_api_tool",
  "arguments": {
    "cursor": "cursor_abc123"  // Get next page of results
  }
}
```

## Complete Example with All Parameters

```javascript
{
  "name": "get_api_tool",
  "arguments": {
    "includeInactive": true,
    "cursor": "previous_cursor_value"
  }
}
```

## Response Structure

The tool returns a structured response with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `workflows` | Array | List of API workflow objects |
| `nextCursor` | String | Pagination cursor for next page (optional) |
| `hasMore` | Boolean | Whether more results are available |

### Workflow Object Structure

Each workflow in the response contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique workflow identifier |
| `name` | String | Workflow name |
| `active` | Boolean | Whether the workflow is active |
| `updatedAt` | String | Last update timestamp (ISO format) |
| `matchReason` | String | Why this workflow was matched (always "Tag: API") |
| `tags` | Array | List of workflow tags |
| `projectId` | String | Associated project ID |

## Pagination Example

To retrieve all API workflows using pagination:

1. First call:
```javascript
{
  "name": "get_api_tool",
  "arguments": {}
}
```

2. If `hasMore` is true, use the `nextCursor`:
```javascript
{
  "name": "get_api_tool",
  "arguments": {
    "cursor": "cursor_from_previous_response"
  }
}
```

3. Continue until `hasMore` is false.

## Common Use Cases

### Get API Tools
```javascript
{
  "name": "get_api_tool",
  "arguments": {}
}
```

### Get Only Active API Tools
```javascript
{
  "name": "get_api_tool",
  "arguments": {
    "includeInactive": false
  }
}
```



## Error Handling

The tool gracefully handles various scenarios:

- **API connection errors**: Returns error message with details
- **Invalid parameters**: Uses default values where possible
- **No results found**: Returns empty workflows array
- **Pagination errors**: Reports pagination issues clearly

## Performance Characteristics

| Operation | API Calls | Response Time | Use Case |
|-----------|-----------|---------------|----------|
| Default query | 1 | ~200-500ms | Quick browsing |
| Paginated requests | 1 per page | ~200-500ms per page | Large dataset browsing |

## Integration Notes

- The tool only returns workflows that are specifically tagged with "API" in n8n
- Results are ordered by n8n's default sorting (typically by update time)
- All timestamps are in ISO 8601 format
- The `matchReason` field will always be "Tag: API" for this tool
- Project IDs are included when available, otherwise "N/A"

## Schema Definition

The tool accepts the following input schema:

```json
{
  "type": "object",
  "properties": {
    "includeInactive": {
      "type": "boolean",
      "description": "Whether to include inactive workflows in the results (default: true)",
      "default": true
    },
    "cursor": {
      "type": "string",
      "description": "Pagination cursor from previous response to get next page of results"
    }
  },
  "required": []
}
``` 