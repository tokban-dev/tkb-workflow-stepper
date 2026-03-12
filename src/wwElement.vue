<template>
  <div class="tk-stepper-root" :style="rootStyle">
    <!-- Inner track: WeWeb only controls the root div, this one is ours -->
    <div class="tk-stepper-track" :style="trackStyle">
      <template v-for="(step, i) in steps" :key="step">
        <!-- Connector line (not before first step) -->
        <span
          v-if="i > 0"
          class="tk-connector"
          :style="connectorInlineStyle(i)"
        ></span>
        <!-- Step pill -->
        <span
          class="tk-step"
          :class="[sizeClass, stepClass(i)]"
          :style="stepStyle(i)"
          @click="handleStepClick(step, i)"
        >{{ step.toUpperCase() }}</span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue';

// ── Step sequences per document type ──
const STEP_SEQUENCES = {
  order:    ['draft', 'approved', 'delivered'],
  delivery: ['draft', 'delivered'],
  invoice:  ['draft', 'approved', 'sent', 'paid'],
  payment:  ['draft', 'confirmed'],
};

// ── Map status string → step index ──
const STATUS_INDEX = {
  order: {
    draft: 0,
    approved: 1,
    partial: 1,
    delivered_partial: 1,
    delivered: 2,
  },
  delivery: {
    draft: 0,
    delivered: 1,
  },
  invoice: {
    draft: 0,
    approved: 1,
    sent: 2,
    paid: 3,
  },
  payment: {
    draft: 0,
    pending: 0,
    confirmed: 1,
  },
};

// Statuses that mean the workflow is terminal/cancelled
const TERMINAL_STATUSES = ['cancelled', 'closed'];

export default {
  props: {
    uid:     { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  setup(props, { emit }) {

    // ── Internal variables ──
    const { value: currentStepIndex, setValue: setCurrentStepIndex } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid, name: 'currentStepIndex', type: 'number', defaultValue: 0,
      });
    const { value: totalSteps, setValue: setTotalSteps } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid, name: 'totalSteps', type: 'number', defaultValue: 3,
      });
    const { value: isCancelledVar, setValue: setIsCancelledVar } =
      wwLib.wwVariable.useComponentVariable({
        uid: props.uid, name: 'isCancelled', type: 'boolean', defaultValue: false,
      });

    // ── Resolved document type ──
    const docType = computed(() => {
      const t = String(props.content?.documentType || 'order').toLowerCase().trim();
      return STEP_SEQUENCES[t] ? t : 'order';
    });

    // ── Steps array for current document type ──
    const steps = computed(() => {
      return STEP_SEQUENCES[docType.value] || STEP_SEQUENCES.order;
    });

    // ── Is current status a terminal state? ──
    const isCancelled = computed(() => {
      const status = String(props.content?.currentStatus || '').toLowerCase().trim();
      return TERMINAL_STATUSES.includes(status);
    });

    // ── Active step index ──
    const activeIndex = computed(() => {
      const status = String(props.content?.currentStatus || 'draft').toLowerCase().trim();
      const map = STATUS_INDEX[docType.value] || STATUS_INDEX.order;
      const idx = map[status];
      return typeof idx === 'number' ? idx : 0;
    });

    // ── Size class ──
    const sizeClass = computed(() => {
      const s = props.content?.size || 'md';
      return `tk-size-${s}`;
    });

    // ── Root style: only CSS variables (WeWeb controls layout on root) ──
    const rootStyle = computed(() => ({
      '--tk-active-color':    props.content?.activeColor    || '#2C3131',
      '--tk-completed-color': props.content?.completedColor || '#4CAF50',
      '--tk-font':            props.content?.fontFamily     || 'inherit',
    }));

    // ── Track style: actual layout (WeWeb can't touch this inner div) ──
    const trackStyle = computed(() => ({
      display:       'flex',
      flexDirection: 'row',
      flexWrap:      'nowrap',
      alignItems:    'center',
      gap:           '0px',
      width:         'max-content',
      minWidth:      'max-content',
      fontFamily:    props.content?.fontFamily || 'inherit',
    }));

    // ── Step state class ──
    const stepClass = (index) => {
      if (isCancelled.value) return 'tk-cancelled';
      if (index < activeIndex.value) return 'tk-done';
      if (index === activeIndex.value) return 'tk-active';
      return '';
    };

    // ── Dynamic step styles (for customizable colors) ──
    const stepStyle = (index) => {
      if (isCancelled.value) return {};
      if (index === activeIndex.value) {
        return {
          backgroundColor: props.content?.activeColor || '#2C3131',
          borderColor:     props.content?.activeColor || '#2C3131',
          color:           '#FFFFFF',
        };
      }
      if (index < activeIndex.value) {
        return {
          backgroundColor: '#EDFAED',
          borderColor:     props.content?.completedColor || '#4CAF50',
          color:           '#1B5E20',
        };
      }
      return {};
    };

    // ── Connector inline style (computed per render to stay reactive) ──
    // Done connectors (≤ activeIndex) → solid + completedColor
    // Future connectors (> activeIndex) → dashed + connectorColor
    // Cancelled → solid + muted gray
    const connectorInlineStyle = (stepIndex) => {
      const width     = props.content?.connectorWidth     || '24px';
      const thickness = props.content?.connectorThickness || '1.5px';
      const thickNum  = parseFloat(thickness) || 1.5;

      const isDoneConnector = !isCancelled.value && stepIndex <= activeIndex.value;

      const resolvedColor = isCancelled.value
        ? '#E8E8E8'
        : isDoneConnector
          ? (props.content?.completedColor || '#4CAF50')
          : (props.content?.connectorColor || '#C9C9C9');

      let background;
      if (isCancelled.value || isDoneConnector) {
        // Solid line for completed progress and cancelled state
        background = resolvedColor;
      } else {
        // Dashed line for steps not yet reached
        const dash = Math.max(thickNum * 4, 6);
        const gap  = Math.max(thickNum * 3, 4);
        background = `repeating-linear-gradient(90deg, ${resolvedColor} 0, ${resolvedColor} ${dash}px, transparent ${dash}px, transparent ${dash + gap}px)`;
      }

      return {
        width,
        height: thickness,
        minWidth: width,
        background,
        flexShrink: '0',
        flexGrow: '0',
        alignSelf: 'center',
        display: 'block',
      };
    };

    // ── Sync internal variables ──
    watch(activeIndex, (v) => setCurrentStepIndex(v), { immediate: true });
    watch(steps, (v) => setTotalSteps(v?.length || 0), { immediate: true });
    watch(isCancelled, (v) => setIsCancelledVar(v), { immediate: true });

    // ── Click handler ──
    const handleStepClick = (step, index) => {
      emit('trigger-event', {
        name: 'step-click',
        event: { step, status: step, index },
      });
    };

    /* wwEditor:start */
    const isEditing = computed(() => props.wwEditorState?.isEditing);
    /* wwEditor:end */

    return {
      steps,
      sizeClass,
      rootStyle,
      trackStyle,
      isCancelled,
      stepClass,
      stepStyle,
      connectorInlineStyle,
      handleStepClick,
      /* wwEditor:start */
      isEditing,
      /* wwEditor:end */
    };
  },
};
</script>

<style scoped>
/* ── Root container ── */
.tk-stepper-root {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0;
  font-family: var(--tk-font);
  width: max-content;
  min-width: max-content;
}

/* ── Step pill (default = future) ── */
.tk-step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
  cursor: default;
  border: 1.5px solid #E8E8E8;
  color: #A8A8A8;
  background: transparent;
  transition: all 0.2s ease;
  line-height: 1;
  box-sizing: border-box;
  letter-spacing: 0.3px;
}

/* ── Sizes ── */
.tk-size-sm {
  padding: 3px 8px;
  font-size: 10px;
}
.tk-size-md {
  padding: 5px 12px;
  font-size: 12px;
}
.tk-size-lg {
  padding: 6px 16px;
  font-size: 13px;
}

/* ── Active step (current) ── */
.tk-step.tk-active {
  background: var(--tk-active-color);
  color: #FFFFFF;
  border-color: var(--tk-active-color);
}

/* ── Done step (completed) ── */
.tk-step.tk-done {
  background: #EDFAED;
  color: #1B5E20;
  border-color: var(--tk-completed-color);
}

/* ── Cancelled / Closed (all muted) ── */
.tk-step.tk-cancelled {
  background: #F4F4F4;
  color: #C9C9C9;
  border-color: #E8E8E8;
}

/* ── Connector: all styles applied inline for full reactivity ── */
.tk-connector {
  flex-shrink: 0;
  flex-grow: 0;
  align-self: center;
  display: block;
}
</style>
