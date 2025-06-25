# Select an API tool from n8n
_Exported on 25/06/2025 at 15:07:55 GMT+5:30 from Cursor (1.1.2)_

---

**User**

get any one api tool from n8n

---

**Cursor**

I'll retrieve an API tool from your n8n instance for you.

I found 42 API-related workflows in your n8n instance! Here's the first API tool I retrieved:

**API Tool: `[AdminTool] merchant_get_pricing`**
- **ID**: `hEUJboc2240zAn7l`
- **Status**: Inactive (not currently running)
- **Last Updated**: June 24th, 2025
- **Tags**: API, Admin Tool, Auto Created
- **Match Reason**: Found in Tools Folder

This appears to be an admin tool for getting merchant pricing information. The system found this along with 41 other API-related workflows, which include various admin tools for merchant management, banking operations, scheduling, and other business functions.

Would you like me to:
1. Get more details about this specific workflow?
2. Show you a few more API tools from the list?
3. Activate this workflow if needed?
4. Get the full workflow definition to see how it works?

---

**User**

list n8n api tool which provides emi_duration of merchant

---

**Cursor**

I'll search for n8n API tools that provide EMI duration information for merchants.

Now let me look at the most promising candidates that might contain EMI duration information. Let me check some of the merchant-related tools to see their detailed workflow definitions:

Perfect! I found the n8n API tool that provides `emi_duration` information for merchants. Here's the tool you're looking for:

## **`[AdminTool] merchant_get_pricing`** 

**Tool Details:**
- **ID**: `hEUJboc2240zAn7l`
- **Name**: `[AdminTool] merchant_get_pricing`
- **Status**: Inactive
- **API Route**: `GET merchants/{id}/pricing/`

**Key Features:**
- **Provides EMI Duration**: This API specifically includes `emi_duration` in its response
- **Merchant-specific**: Retrieves pricing details for a specific merchant using their ID
- **Comprehensive Pricing Data**: Returns detailed pricing rules and configurations

**Input Required:**
- `id` (string): The merchant ID

**Output Includes:**
The response contains a `rules` array where each rule object includes:
- `emi_duration` ✅ (This is what you need!)
- `plan_id`, `plan_name`
- `product`, `feature`, `type`
- `gateway`, `procurer`
- `payment_method`, `payment_method_type`, `payment_method_subtype`
- `auth_type`, `payment_network`, `payment_issuer`
- `international`, `fee_bearer`
- `percent_rate`, `fixed_rate`, `min_fee`, `max_fee`
- And many other pricing-related fields

**Usage:**
```
API Call: GET merchants/{merchant_id}/pricing/
Example: GET merchants/12345/pricing/
```

This tool is perfect for retrieving EMI duration information along with comprehensive pricing details for any specific merchant in your system.

Would you like me to:
1. Activate this workflow?
2. Show you how to execute it with a specific merchant ID?
3. Get more details about the EMI duration field structure?

```plaintext
API Call: GET merchants/{merchant_id}/pricing/
Example: GET merchants/12345/pricing/
```

---

**User**

How did you selected the tool 

---

**Cursor**

Great question! Let me walk you through my selection process step by step:

## **My Selection Methodology:**

### **Step 1: Initial Search**
I first retrieved all API tools using `get_api_tool` and found 42 API-related workflows. I was looking for tools that might contain EMI duration information for merchants.

### **Step 2: Filtering by Keywords**
From the list of 42 tools, I identified potential candidates based on their names that seemed merchant-related and could potentially contain EMI information:

**Potential Candidates I Considered:**
- `[AdminTool] merchant_get_pricing` ← **Most promising** (pricing often includes EMI terms)
- `[AdminTool] merchant_info` ← (general merchant info)
- `[AdminTool] merchant_details_fetch` ← (detailed merchant data)
- `[AdminTool] pricing_get_merchant_plans` ← (pricing plans)

### **Step 3: Detailed Examination**
I then examined each candidate's workflow definition using `get_workflow` to see their API documentation:

### **Step 4: The Decisive Evidence**
When I examined `[AdminTool] merchant_get_pricing` (ID: `hEUJboc2240zAn7l`), I found this **key evidence** in the Sticky Note documentation:

```
#### Expected Output: 
- response:
  - rules:
    - emi_duration  ← **BINGO! This was the smoking gun**
    - plan_id
    - plan_name
    - product
    - feature
    - type
    - gateway
    - ...
```

### **Step 5: Why I Ruled Out Other Tools**

**`[AdminTool] merchant_info`**: 
- Very comprehensive merchant data but no mention of `emi_duration` in the expected output
- Focuses on KYC, business details, documents, stakeholders, transactions

**`[AdminTool] merchant_details_fetch`**: 
- Generic description: "Fetches detailed information about merchants"
- Empty response array `[]` - not useful

**`[AdminTool] pricing_get_merchant_plans`**: 
- Only returns high-level plan info: `plan_id`, `plan_name`, `org_id`, `type`, `rules_count`
- No detailed rule attributes like `emi_duration`

### **Step 6: Confirmation**
The `merchant_get_pricing` tool explicitly lists `emi_duration` as one of the fields in the `rules` array within its expected output documentation. This was **definitive proof** that this tool provides the EMI duration information you requested.

## **Why This Method Works:**
1. **Systematic Search**: I didn't just guess - I retrieved all available tools
2. **Keyword-Based Filtering**: Focused on merchant and pricing-related tools
3. **Documentation Review**: Examined the actual API specifications, not just names
4. **Explicit Field Matching**: Found the exact field name `emi_duration` in the expected output

The key was that each n8n workflow includes detailed documentation in its "Sticky Note" that explicitly lists the expected input and output fields, making it possible to identify exactly which API provides specific data fields.

```plaintext
#### Expected Output: 
- response:
  - rules:
    - emi_duration  ← **BINGO! This was the smoking gun**
    - plan_id
    - plan_name
    - product
    - feature
    - type
    - gateway
    - ...
```

