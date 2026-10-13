import React from 'react';

type Step = {
  id: number;
  label: string;
};

type ProgressBarProps = {
  steps: Step[];
  active: number;
};

/**
 * Horizontal stepper that visualizes the current step.
 * Completed steps are checked, the active one is highlighted.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, active }) => {
  return (
    <ol className="flex items-start">
      {steps.map((step, idx) => {
        const done = idx < active;
        const current = idx === active;
        return (
          <li key={step.id} className="relative flex flex-1 flex-col items-center text-center">
            {idx > 0 && (
              <span
                className={`absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 ${idx <= active ? 'bg-primary' : 'bg-slate-200'}`}
              />
            )}
            <span
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ring-4 ring-white transition ${
                done
                  ? 'bg-emerald-500 text-white'
                  : current
                  ? 'scale-110 bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? '✓' : step.id}
            </span>
            <span
              className={`mt-2 px-1 text-xs sm:text-sm ${
                current ? 'font-bold text-primary' : done ? 'font-medium text-emerald-600' : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default ProgressBar;
