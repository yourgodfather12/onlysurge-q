import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'bg-purple-900/90 text-white border border-purple-800/50 backdrop-blur-sm',
        duration: 4000,
        style: {
          background: 'rgba(88, 28, 135, 0.9)',
          color: 'white',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(126, 34, 206, 0.5)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
      }}
    />
  );
}