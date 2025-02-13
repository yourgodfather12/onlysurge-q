import React from 'react';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert
              variant="error"
              title="Something went wrong"
              className="mb-6"
            >
              <p className="text-gray-300">
                We're sorry, but something unexpected happened. Please try again or return to the dashboard.
              </p>
              {this.state.error && (
                <pre className="mt-4 p-4 bg-red-500/10 rounded-lg text-sm overflow-auto">
                  {this.state.error.message}
                </pre>
              )}
            </Alert>

            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
                icon={<Home className="w-4 h-4" />}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}