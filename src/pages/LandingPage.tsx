import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log('User is signed in:', user.email);
    } else {
      console.log('User is signed out');
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <header className="relative py-24">
        <div className="absolute inset-0">
          <img
            src="/bg-pattern.svg"
            alt="Background Pattern"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Visualize Your Network Topology
            </h1>
            <p className="mt-6 text-xl text-slate-300 max-w-3xl mx-auto">
              Discover, map, and monitor your network infrastructure with ease. LumenNet provides a comprehensive view of your network, helping you identify vulnerabilities and optimize performance.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link
                to="/dashboard"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
              <a
                href="#features"
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">LN</span>
                </div>
                <span className="text-white text-xl font-bold">LumenNet</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/documentation"
                className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Documentation
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white">Key Features</h2>
            <p className="mt-4 text-slate-400">Explore the powerful features that LumenNet offers to enhance your network management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-colors">
              <div className="text-cyan-400 text-3xl mb-4">
                {/* Replace with an actual icon */}
                ⚙️
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Automated Discovery</h3>
              <p className="text-slate-400">Automatically discover and map your network devices and connections.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-colors">
              <div className="text-blue-400 text-3xl mb-4">
                {/* Replace with an actual icon */}
                🛡️
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Security Monitoring</h3>
              <p className="text-slate-400">Monitor your network for security threats and vulnerabilities in real-time.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-colors">
              <div className="text-green-400 text-3xl mb-4">
                {/* Replace with an actual icon */}
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Optimization</h3>
              <p className="text-slate-400">Optimize your network performance with detailed analytics and insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-slate-400">
            Join LumenNet today and transform the way you manage your network.
          </p>
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} LumenNet. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default LandingPage;
