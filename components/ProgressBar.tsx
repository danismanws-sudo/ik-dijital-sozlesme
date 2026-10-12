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
 * Simple horizontal progress bar that visualizes the current step.
 * It renders each step label and highlights the active one.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ steps, active }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full ${idx === active ? 'bg-accent text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            {step.id}
          </div>
          <span className={`ml-2 ${idx === active ? 'font-semibold' : 'text-gray-500'}`}>
            {step.label}
          </span>
          {idx < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-300 mx-2" />}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
