import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSignIn = location.pathname === '/signin';
  const [showDevLogin, setShowDevLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Zap className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold">OnlySurge</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-2">
              {isSignIn ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-400">
              {isSignIn
                ? 'Sign in to access your dashboard'
                : 'Start growing your social presence today'}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-900/20 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm"
        >
          <AuthForm mode={isSignIn ? 'signin' : 'signup'} />
          
          <div className="mt-6 text-center text-sm text-gray-400">
            {isSignIn ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/signin')}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {/* Development Login */}
          {import.meta.env.DEV && (
            <div className="mt-8 pt-6 border-t border-purple-800/30">
              <button
                onClick={() => setShowDevLogin(!showDevLogin)}
                className="text-sm text-gray-400 hover:text-white"
              >
                Development Login
              </button>
              {showDevLogin && (
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      localStorage.setItem('dev_credentials', JSON.stringify({
                        email: 'creator@example.com',
                        password: 'password123'
                      }));
                      navigate('/dashboard');
                    }}
                  >
                    Login as Creator
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      localStorage.setItem('dev_credentials', JSON.stringify({
                        email: 'admin@example.com',
                        password: 'admin123'
                      }));
                      navigate('/dashboard');
                    }}
                  >
                    Login as Admin
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}