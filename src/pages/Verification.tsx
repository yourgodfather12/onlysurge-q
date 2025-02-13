import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  HelpCircle,
  Camera,
  FileText,
  X
} from 'lucide-react';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

interface VerificationStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'current' | 'completed';
}

export function Verification() {
  const [verificationStatus] = useState<VerificationStatus>('unverified');
  const [currentStep, setCurrentStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const steps: VerificationStep[] = [
    {
      title: 'Personal Information',
      description: 'Provide your basic details and contact information',
      icon: <FileText className="w-5 h-5" />,
      status: currentStep > 0 ? 'completed' : currentStep === 0 ? 'current' : 'pending'
    },
    {
      title: 'Identity Document',
      description: 'Upload a valid government-issued ID',
      icon: <Camera className="w-5 h-5" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending'
    },
    {
      title: 'Selfie Verification',
      description: 'Take a photo of yourself holding your ID',
      icon: <Camera className="w-5 h-5" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending'
    }
  ];

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>Verified</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock className="w-5 h-5" />
            <span>Pending Review</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>Verification Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-400">
            <Shield className="w-5 h-5" />
            <span>Unverified</span>
          </div>
        );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Legal First Name"
                placeholder="Enter your first name"
              />
              <Input
                label="Legal Last Name"
                placeholder="Enter your last name"
              />
            </div>
            <Input
              label="Date of Birth"
              type="date"
              placeholder="Select your date of birth"
            />
            <Input
              label="Address"
              placeholder="Enter your full address"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                placeholder="Enter city"
              />
              <Input
                label="State/Province"
                placeholder="Enter state"
              />
              <Input
                label="Postal Code"
                placeholder="Enter postal code"
              />
            </div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter phone number"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-purple-800/50 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload ID Document</h3>
              <p className="text-gray-400 mb-4">
                Upload a clear photo of your government-issued ID (passport, driver's license, or national ID card)
              </p>
              <Button
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
              >
                Choose File
              </Button>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Requirements:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Document must be valid and not expired
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  All text must be clearly visible
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Photo must be in color
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  File size must be under 5MB
                </li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-purple-800/50 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Take Selfie with ID</h3>
              <p className="text-gray-400 mb-4">
                Take a clear photo of yourself holding your ID next to your face
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  icon={<Camera className="w-4 h-4" />}
                >
                  Open Camera
                </Button>
                <Button
                  variant="outline"
                  icon={<Upload className="w-4 h-4" />}
                >
                  Upload Photo
                </Button>
              </div>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">Requirements:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Face and ID must be clearly visible
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Good lighting conditions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Neutral background
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  No filters or editing
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Verification</h1>
          <p className="text-gray-400">Complete your identity verification to start creating content.</p>
        </div>
        <div className="flex items-center gap-2">
          {renderVerificationStatus()}
          <Button
            variant="outline"
            size="sm"
            icon={<HelpCircle className="w-4 h-4" />}
            onClick={() => setShowGuide(true)}
          >
            Guide
          </Button>
        </div>
      </div>

      {/* Verification Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Steps Sidebar */}
            <div className="md:w-64 shrink-0">
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      step.status === 'current' ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.status === 'completed'
                        ? 'bg-green-500'
                        : step.status === 'current'
                        ? 'bg-purple-500'
                        : 'bg-purple-900/20'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
                  disabled={currentStep === 2}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Verification Guide</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => setShowGuide(false)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Why verify?</h4>
                      <p className="text-gray-400">
                        Verification helps ensure platform safety and compliance with regulations.
                        It's required for all content creators.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">What you'll need:</h4>
                      <ul className="space-y-2 text-gray-400">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          Valid government-issued ID
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          Proof of address
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-purple-400" />
                          Working camera for selfie verification
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Processing time:</h4>
                      <p className="text-gray-400">
                        Verification typically takes 1-2 business days. You'll be notified
                        once your verification is complete.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => setShowGuide(false)}
                    >
                      Got it
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}