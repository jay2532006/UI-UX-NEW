import React from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * WorkshopTimeline — visual horizontal status timeline.
 * MASTER_PROMPT Section 13.2: "A custom visual component, not a table."
 * Shows: Proposed → Under Review → Accepted/Rejected
 *
 * @param {number} status - Workshop status (0=Pending, 1=Accepted, 2=Rejected)
 */
export default function WorkshopTimeline({ status }) {
  // Define timeline steps
  const steps = [
    {
      label: 'Proposed',
      icon: FileText,
      complete: status >= 0,
      active: status === 0,
    },
    {
      label: 'Under Review',
      icon: Clock,
      complete: status >= 1 || status === 2,
      active: status === 0,
    },
    {
      label: status === 2 ? 'Rejected' : 'Accepted',
      icon: status === 2 ? XCircle : CheckCircle,
      complete: status === 1 || status === 2,
      active: false,
      variant: status === 2 ? 'rejected' : status === 1 ? 'accepted' : 'default',
    },
  ];

  const getStepColor = (step) => {
    if (step.variant === 'rejected' && step.complete) return 'text-red-600 bg-red-100 border-red-300';
    if (step.variant === 'accepted' && step.complete) return 'text-green-600 bg-green-100 border-green-300';
    if (step.complete) return 'text-fossee-primary bg-blue-100 border-fossee-primary';
    if (step.active) return 'text-amber-600 bg-amber-100 border-amber-300';
    return 'text-gray-400 bg-gray-100 border-gray-300';
  };

  const getLineColor = (idx) => {
    const nextStep = steps[idx + 1];
    if (!nextStep) return '';
    if (nextStep.complete) {
      if (nextStep.variant === 'rejected') return 'bg-red-300';
      if (nextStep.variant === 'accepted') return 'bg-green-300';
      return 'bg-fossee-primary';
    }
    if (nextStep.active) return 'bg-amber-300';
    return 'bg-gray-200';
  };

  return (
    <div className="w-full" role="list" aria-label="Workshop status timeline">
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              {/* Step circle + label */}
              <div
                className="flex flex-col items-center gap-2"
                role="listitem"
                aria-current={step.active ? 'step' : undefined}
              >
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${getStepColor(step)}`}>
                  <Icon size={18} aria-hidden="true" />
                </div>
                <span className={`text-xs font-semibold ${step.complete || step.active ? 'text-fossee-dark' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${getLineColor(idx)}`} aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="sm:hidden space-y-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="flex items-start gap-3" role="listitem" aria-current={step.active ? 'step' : undefined}>
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${getStepColor(step)}`}>
                  <Icon size={14} aria-hidden="true" />
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-8 ${getLineColor(idx)}`} aria-hidden="true" />
                )}
              </div>

              {/* Label */}
              <div className="pt-1">
                <span className={`text-sm font-semibold ${step.complete || step.active ? 'text-fossee-dark' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
