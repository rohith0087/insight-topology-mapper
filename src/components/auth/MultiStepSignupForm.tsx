
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, Mail, Lock, User, Building, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface MultiStepSignupFormProps {
  onBackToLogin: () => void;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
}

const MultiStepSignupForm: React.FC<MultiStepSignupFormProps> = ({ onBackToLogin }) => {
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<SignupData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  const totalSteps = 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const isPersonalEmail = (email: string) => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return personalDomains.includes(domain);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          setError('Company name is required');
          return false;
        }
        return true;
      
      case 2:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError('First and last name are required');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (isPersonalEmail(formData.email)) {
          setError('Please use your work email address, not a personal email like Gmail or Outlook');
          return false;
        }
        return true;
      
      case 3:
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    setError('');

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.companyName
    );
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Company Information';
      case 2: return 'Personal Information';
      case 3: return 'Account Security';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Let\'s start with your company details';
      case 2: return 'Tell us about yourself';
      case 3: return 'Create a secure password';
      default: return '';
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <Alert className="border-green-500/50 bg-green-950/50 text-green-100">
          <AlertDescription>
            Account created successfully! Please check your email to verify your account.
            As the first user from your company, you have been granted Super Admin privileges.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={onBackToLogin}
          variant="outline" 
          className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-800"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white">{getStepTitle()}</h3>
        <p className="text-slate-400 mt-1">{getStepDescription()}</p>
      </div>

      {error && (
        <Alert className="border-red-500/50 bg-red-950/50 text-red-100">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Step Content */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-slate-200">Company Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="companyName"
                name="companyName"
                type="text"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              This will be used to set up your organization's security operations center
            </p>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Work Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your work email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Please use your work email address (not Gmail, Outlook, etc.)
            </p>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <p className="text-xs text-slate-400">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
                className="pl-10 bg-slate-900 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            disabled={loading}
            variant="outline"
            className="flex-1 bg-transparent border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            disabled={loading}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-sm text-cyan-400 hover:text-cyan-300 underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

export default MultiStepSignupForm;
