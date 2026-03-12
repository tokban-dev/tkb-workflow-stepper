export default {
  editor: {
    label: { en: 'Tokban Workflow Stepper' },
    icon: 'fontawesome/solid/arrows-left-right',
  },
  triggerEvents: [
    {
      name: 'step-click',
      label: { en: 'On step click' },
      event: { step: '', status: '', index: 0 },
    },
  ],
  properties: {

    // ─────────────────────────────────────────
    // DATA BINDING
    // ─────────────────────────────────────────
    documentType: {
      label: { en: 'Document Type' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'order', label: 'Sales / Purchase Order' },
          { value: 'delivery', label: 'Delivery' },
          { value: 'invoice', label: 'Invoice' },
          { value: 'payment', label: 'Payment (AR/AP)' },
        ],
      },
      defaultValue: 'order',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Document type determines the step sequence. Valid: order | delivery | invoice | payment',
      },
      propertyHelp: {
        tooltip: 'Each document type has its own workflow steps. "order" covers both sales and purchase orders.',
      },
      /* wwEditor:end */
    },
    currentStatus: {
      label: { en: 'Current Status' },
      type: 'Text',
      section: 'settings',
      defaultValue: 'draft',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Bind to the status field from your data (e.g. draft, approved, delivered, paid, confirmed).',
      },
      propertyHelp: {
        tooltip: 'The component auto-resolves which step to highlight based on the status value and document type.',
      },
      /* wwEditor:end */
    },

    // ─────────────────────────────────────────
    // DISPLAY OPTIONS
    // ─────────────────────────────────────────
    size: {
      label: { en: 'Size' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
      defaultValue: 'md',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Valid values: sm | md | lg',
      },
      /* wwEditor:end */
    },

    // ─────────────────────────────────────────
    // STYLE TAB
    // ─────────────────────────────────────────
    activeColor: {
      label: { en: 'Active Step Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#2C3131',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Background color for the current active step pill.',
      },
      /* wwEditor:end */
    },
    completedColor: {
      label: { en: 'Completed Border Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#4CAF50',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Border accent color for completed steps.',
      },
      /* wwEditor:end */
    },
    connectorWidth: {
      label: { en: 'Connector Width' },
      type: 'Length',
      section: 'style',
      defaultValue: '24px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Width of the connector line between steps.',
      },
      /* wwEditor:end */
    },
    connectorColor: {
      label: { en: 'Connector Color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#C9C9C9',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Color of the connector line between steps.',
      },
      /* wwEditor:end */
    },
    connectorThickness: {
      label: { en: 'Connector Thickness' },
      type: 'Length',
      section: 'style',
      defaultValue: '1.5px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Thickness of the connector line (e.g. 1px, 2px).',
      },
      /* wwEditor:end */
    },
    connectorSpacing: {
      label: { en: 'Connector Spacing' },
      type: 'Length',
      section: 'style',
      defaultValue: '4px',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Gap between each step pill and its connector line (e.g. 4px, 8px).',
      },
      propertyHelp: {
        tooltip: 'Controls the breathing room between step labels and the connecting lines.',
      },
      /* wwEditor:end */
    },
    fontFamily: {
      label: { en: 'Font Family' },
      type: 'Text',
      section: 'style',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: {
        type: 'string',
        tooltip: 'Override font family. Leave empty to inherit from parent.',
      },
      /* wwEditor:end */
    },
  },
};
