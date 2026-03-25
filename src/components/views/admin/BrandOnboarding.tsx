'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  id: number;
  title: string;
  completed: boolean;
}

export default function BrandOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    headquarters: ''
  });

  const steps: OnboardingStep[] = [
    { id: 1, title: 'Brand Info', completed: false },
    { id: 2, title: 'Upload Plan', completed: false },
    { id: 3, title: 'Map to Model', completed: false },
    { id: 4, title: 'Set Guardrails', completed: false },
    { id: 5, title: 'Configure Rates', completed: false },
    { id: 6, title: 'Configure Splits', completed: false },
    { id: 7, title: 'Generate Handbook', completed: false },
    { id: 8, title: 'Notify Reps', completed: false }
  ];

  const templates = [
    { id: 'gp_tiered', name: 'Start from GP% Tiered', description: 'Commission based on gross profit percentage tiers' },
    { id: 'draw', name: 'Start from Draw', description: 'Base draw amount with commission on excess' },
    { id: 'salary_bonus', name: 'Start from Salary + Bonus', description: 'Fixed salary with variable bonus component' },
    { id: 'production', name: 'Start from Production', description: 'Hourly base with per-job bonuses' },
    { id: 'revenue_share', name: 'Start from Revenue Share', description: 'Direct percentage of revenue' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const goToStep = (stepNum: number) => {
    if (stepNum <= currentStep + 1) {
      setCurrentStep(stepNum);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Brand Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Brand Name</label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={e => handleInputChange('brandName', e.target.value)}
                  placeholder="e.g., Acme Corporation"
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Industry</label>
                <select className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
                  <option>Technology</option>
                  <option>Manufacturing</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Retail</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Headquarters</label>
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Upload Commission Plan</h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">Choose a template to get started or upload existing plan documentation.</p>
              <div className="grid grid-cols-1 gap-3">
                {templates.map(template => (
                  <div key={template.id} className="border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors">
                    <div className="font-medium text-[var(--color-text-primary)]">{template.name}</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">{template.description}</div>
                  </div>
                ))}
              </div>
              <div className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
                <div className="text-sm text-[var(--color-text-secondary)]">Or drag and drop your plan document here</div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Map to Commission Model</h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">Select the commission model that matches your plan structure.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)]">
                  <input type="radio" name="model" defaultChecked className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">GP% Tiered</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Commission varies by gross profit percentage tiers</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)]">
                  <input type="radio" name="model" className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Draw Against</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Base draw amount with commission on excess</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg-hover)]">
                  <input type="radio" name="model" className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">Salary + Bonus</div>
                    <div className="text-sm text-[var(--color-text-secondary)]">Fixed salary with variable bonus</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Set Guardrails</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Minimum Commission Rate (%)</label>
                <input type="number" placeholder="0.0" className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Maximum Commission Rate (%)</label>
                <input type="number" placeholder="25.0" className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Clawback Period (days)</label>
                <input type="number" placeholder="90" className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Configure Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left py-2 px-4 text-[var(--color-text-secondary)]">Tier/Category</th>
                    <th className="text-left py-2 px-4 text-[var(--color-text-secondary)]">Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 px-4">Tier 1: 0-10% GP</td>
                    <td className="py-3 px-4">
                      <input type="number" placeholder="0.0" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--color-border)]">
                    <td className="py-3 px-4">Tier 2: 11-25% GP</td>
                    <td className="py-3 px-4">
                      <input type="number" placeholder="0.0" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Tier 3: 25%+ GP</td>
                    <td className="py-3 px-4">
                      <input type="number" placeholder="0.0" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Configure Splits</h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">Define how commissions are split between multiple reps.</p>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Canvasser/Closer Split</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" defaultValue="30" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                  <span>%</span>
                  <span>/</span>
                  <input type="number" min="0" max="100" defaultValue="70" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                  <span>%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Training/Mentorship Split</label>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="100" defaultValue="20" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                  <span>%</span>
                  <span>/</span>
                  <input type="number" min="0" max="100" defaultValue="80" className="w-16 px-2 py-1 border border-[var(--color-border)] rounded bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]" />
                  <span>%</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Generate Handbook</h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">Generate a rep handbook documenting the commission plan details.</p>
              <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
                <div className="text-sm font-medium text-[var(--color-text-primary)] mb-2">Handbook Preview</div>
                <div className="bg-[var(--color-bg-primary)] p-4 rounded text-sm text-[var(--color-text-secondary)] space-y-2">
                  <div>Commission Plan Documentation</div>
                  <div>Plan Type: GP% Tiered</div>
                  <div>Effective Date: Today</div>
                  <div>...</div>
                </div>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-button-primary)]" />
                <span className="text-sm text-[var(--color-text-secondary)]">Include version history</span>
              </label>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Notify Reps</h2>
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)]">Send notifications to reps about the new plan.</p>
              <div className="bg-[var(--color-success-bg)] border border-[var(--color-success)] rounded-lg p-4">
                <div className="text-sm text-[var(--color-success)] font-medium">✓ Onboarding Complete</div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Send email notification to all reps</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Request acknowledgment from reps</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-[var(--color-button-primary)]" />
                  <span className="text-sm text-[var(--color-text-secondary)]">Schedule live training session</span>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Brand Onboarding Wizard</h1>
        <div className="bg-[var(--color-warning-bg)] border border-[var(--color-warning)] rounded-lg p-4 flex items-start gap-3">
          <div className="text-xl">⚙️</div>
          <div>
            <div className="font-medium text-[var(--color-text-primary)]">Configuration, not development</div>
            <div className="text-sm text-[var(--color-text-secondary)]">This wizard configures commission plans through templates and forms, not custom code.</div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">Step {currentStep} of {steps.length}</span>
          <span className="text-sm text-[var(--color-text-secondary)]">{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-button-primary)] transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-8 gap-2 mt-4">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                currentStep === step.id
                  ? 'bg-[var(--color-button-primary)] text-white'
                  : currentStep > step.id
                  ? 'bg-[var(--color-success)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
              }`}
              disabled={currentStep < step.id}
            >
              {currentStep > step.id ? '✓' : step.id}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover)] transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextStep}
          className="px-6 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors"
        >
          {currentStep === 8 ? 'Complete Onboarding' : 'Next'}
        </button>
      </div>
    </div>
  );
}
