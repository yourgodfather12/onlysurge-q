// Monitoring and error tracking setup
import * as Sentry from '@sentry/browser';
import { toast } from 'react-hot-toast';

// Initialize Sentry
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Don't send errors in development
    if (import.meta.env.DEV) {
      console.error('Sentry would capture:', event);
      return null;
    }
    return event;
  }
});

// Error boundary for React components
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }
}

// Custom error with status code
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Global error handler
export function setupErrorHandling() {
  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event.reason);
    toast.error('An unexpected error occurred');
  });

  window.addEventListener('error', (event) => {
    Sentry.captureException(event.error);
    toast.error('An unexpected error occurred');
  });
}

// Performance monitoring
export const performance = {
  mark(name: string) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  },
  measure(name: string, startMark: string, endMark: string) {
    if (window.performance && window.performance.measure) {
      try {
        const measure = window.performance.measure(name, startMark, endMark);
        Sentry.captureMessage('Performance measure', {
          extra: {
            name,
            duration: measure.duration
          }
        });
      } catch (e) {
        console.error('Performance measurement error:', e);
      }
    }
  }
};

// Usage tracking
export const analytics = {
  trackEvent(name: string, properties: Record<string, any> = {}) {
    // Send to your analytics provider
    if (import.meta.env.PROD) {
      // Example: Mixpanel, Amplitude, etc.
      console.log('Track event:', name, properties);
    }
  },
  trackError(error: Error, properties: Record<string, any> = {}) {
    Sentry.captureException(error, { extra: properties });
  }
};