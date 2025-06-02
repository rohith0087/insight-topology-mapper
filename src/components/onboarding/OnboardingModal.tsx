
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { CheckCircle, Clock, ArrowRight, ArrowLeft, X } from 'lucide-react';
import OnboardingWelcome from './steps/OnboardingWelcome';
import OnboardingDataSource from './steps/OnboardingDataSource';
import OnboardingTopologyTour from './steps/OnboardingTopologyTour';
import OnboardingMonitoringSetup from './steps/OnboardingMonitoringSetup';
import OnboardingDashboardSetup from './steps/OnboardingDashboardSetup';

const OnboardingModal: React.FC = () => {
  const {
    steps,
    progress,
    isOnboardingVisible,
    setIsOnboardingVisible,
    currentStep,
    completionPercentage,
    isStepCompleted,
    completeStep,
    skipOnboarding,
    isUpdating
  } = useOnboarding();

  if (!isOnboardingVisible || !currentStep) return null;

  const handleNext = () => {
    if (currentStep && progress) {
      const nextStepId = currentStep.id + 1;
      completeStep(nextStepId);
    }
  };

  const handlePrevious = () => {
    if (currentStep && currentStep.id > 1) {
      const prevStepId = currentStep.id - 1;
      completeStep(prevStepId);
    }
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.component) {
      case 'welcome':
        return <OnboardingWelcome onNext={handleNext} />;
      case 'data-source':
        return <OnboardingDataSource onNext={handleNext} />;
      case 'topology-tour':
        return <OnboardingTopologyTour onNext={handleNext} />;
      case 'monitoring-setup':
        return <OnboardingMonitoringSetup onNext={handleNext} />;
      case 'dashboard-setup':
        return <OnboardingDashboardSetup onNext={handleNext} />;
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">{currentStep.title}</h3>
            <p className="text-slate-400 mb-6">{currentStep.description}</p>
            <Button onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-700">
              Continue
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOnboardingVisible} onOpenChange={setIsOnboardingVisible}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              Welcome to LumenNet
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOnboardingVisible(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Step {currentStep.id} of {steps.length}</span>
              <span className="text-slate-400">{completionPercentage}% Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-center space-x-4 py-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step.id === currentStep.id 
                    ? 'bg-cyan-600 text-white' 
                    : isStepCompleted(step.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-600 text-slate-300'
                  }
                `}>
                  {isStepCompleted(step.id) ? <CheckCircle className="w-4 h-4" /> : step.id}
                </div>
                {step.id < steps.length && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isStepCompleted(step.id) ? 'bg-green-600' : 'bg-slate-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step Info */}
          <div className="text-center border-b border-slate-600 pb-4">
            <h3 className="text-xl font-semibold text-slate-200 mb-2">{currentStep.title}</h3>
            <p className="text-slate-400 mb-2">{currentStep.description}</p>
            {currentStep.estimatedTime && (
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span>Estimated time: {currentStep.estimatedTime}</span>
              </div>
            )}
            {currentStep.isOptional && (
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mt-2">
                Optional
              </span>
            )}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-600">
            <div className="flex space-x-2">
              {currentStep.id > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isUpdating}
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              {currentStep.isOptional && (
                <Button
                  variant="ghost"
                  onClick={handleNext}
                  disabled={isUpdating}
                  className="text-slate-400 hover:text-white"
                >
                  Skip Step
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-slate-600 hover:bg-slate-700"
              >
                Skip Onboarding
              </Button>
              {currentStep.id < steps.length && (
                <Button
                  onClick={handleNext}
                  disabled={isUpdating}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isUpdating ? 'Saving...' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
