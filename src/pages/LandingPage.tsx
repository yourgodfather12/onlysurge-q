import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Rocket, Clock, CheckCircle } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-pink-900/30 animate-gradient-xy" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(144,63,249,0.1),transparent_50%)] animate-pulse-slow" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4">
          <nav className="flex justify-between items-center py-8">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-purple-400" />
                <span className="text-2xl font-bold">OnlySurge</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => navigate('/features')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/signin')}
                className="hidden md:block text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold transition-all"
              >
                Get Started
              </button>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto text-center py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white">
                Supercharge Your Social Growth
              </h1>
              <p className="text-xl text-gray-300">
                Accelerate your social media presence with our powerful growth tools. Get real followers, engagement, and results.
              </p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold text-lg transition-all"
                >
                  Start Growing Now
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-2 bg-transparent border-2 border-purple-600 hover:bg-purple-600/20 px-8 py-4 rounded-full font-semibold text-lg transition-all">
                  View Pricing
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-4xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-4xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-5xl" />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm">
            <Shield className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
            <p className="text-gray-300">
              Our services are 100% safe and compliant with platform guidelines.
            </p>
          </div>
          <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm">
            <Rocket className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-gray-300">
              See your social presence grow immediately with our powerful tools.
            </p>
          </div>
          <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-800/50 backdrop-blur-sm">
            <Clock className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-gray-300">
              Our dedicated team is always here to help you succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Trusted by Creators Worldwide</h2>
          <p className="text-gray-300">Join thousands of satisfied customers who've grown their social presence</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-purple-900/10 p-6 rounded-xl border border-purple-800/30">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "OnlySurge helped me grow my following from 1K to 100K in just three months. Their service is incredible!"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={`https://source.unsplash.com/random/100x100?portrait=${i}`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">Social Creator {i}</p>
                  <p className="text-sm text-gray-400">@creator{i}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 text-center backdrop-blur-sm border border-purple-800/30">
          <h2 className="text-4xl font-bold mb-4">Ready to Surge?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already growing their social presence with OnlySurge.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="group flex items-center gap-2 bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all mx-auto"
          >
            Get Started Now
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400 border-t border-purple-800/30">
        <p>© 2024 OnlySurge. All rights reserved.</p>
      </footer>
    </div>
  );
}