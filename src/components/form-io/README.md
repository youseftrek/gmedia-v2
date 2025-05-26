# Dynamic Form Renderer

The `ModularDynamicFormRenderer` is a flexible form renderer for JSON-based form schemas with complex field dependencies.

## Features

- Renders forms based on JSON schema definition
- Supports various field types: text, textarea, select, file uploads, etc.
- Handles complex field dependencies and conditional logic
- Supports multi-language forms through translation keys
- Auto-populates select options from API endpoints
- Handles nested dependencies between selects (cascading dropdowns)
- Form validation with Zod schema

## Dependent Select Fields

The form renderer supports dependent select fields where the options in one select depend on the value selected in another field. This is useful for:

1. **Cascading Dropdowns**: For example, selecting a region populates cities, then selecting a city populates districts.

2. **Auto-filling Fields**: When a select option is chosen, it can auto-fill other fields with related data.

### Configuration Examples

#### Basic Dependency with refreshOn

```json
{
  "label": "City",
  "type": "select",
  "key": "cities",
  "dataSrc": "url",
  "data": {
    "url": "https://api.example.com/address/{{data.areas}}/cities"
  },
  "refreshOn": "areas"
}
```

This configuration will:

- Watch for changes to the 'areas' field
- When 'areas' changes, fetch new options from the URL with the selected area ID
- Reset the selected city when the area changes

#### Multiple Dependencies

```json
{
  "label": "Sub-districts",
  "type": "select",
  "key": "subdistricts",
  "dataSrc": "url",
  "data": {
    "url": "https://api.example.com/{{data.cities}}/{{data.districts}}/subdistricts"
  },
  "refreshOn": "cities,districts"
}
```

This will reload options when either cities or districts changes.

#### Auto-filling with Logic Triggers

Using JavaScript logic, you can implement complex behavior like auto-filling multiple fields when an option is selected:

```json
{
  "label": "Sub Activity",
  "type": "select",
  "key": "subActivity",
  "dataSrc": "url",
  "data": {
    "url": "https://api.example.com/commercial-record-details?id={{data.commercialRecords}}"
  },
  "refreshOn": "commercialRecords",
  "logic": [
    {
      "name": "onSubActivityChanges",
      "trigger": {
        "type": "javascript",
        "javascript": "// JavaScript to handle auto-filling other fields"
      }
    }
  ]
}
```

When the subActivity is selected, the JS logic can update other form fields like activity, fees, issuance type, etc.

## Implementation Notes

- The form watches for changes in field values and handles resetting dependent fields
- URL templates with `{{data.fieldName}}` are automatically populated with the current value
- Logic triggers are executed when field values change
- Dependent fields wait for their dependencies to have values before fetching options
