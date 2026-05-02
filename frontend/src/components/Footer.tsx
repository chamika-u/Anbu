import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-ibm-blue rounded-lg flex items-center justify-center text-white font-black text-sm">A</div>
              <span className="text-lg font-black text-ibm-gray tracking-tight">ANBU</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-medium">
              Revolutionizing developer onboarding with AI-driven documentation and interactive setup flows.
              Built for the next generation of software engineering.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-black text-ibm-gray uppercase tracking-widest mb-5">Product</h3>
            <ul className="space-y-3 text-sm font-bold text-gray-400">
              <li><a href="/dashboard" className="hover:text-ibm-blue transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-ibm-blue transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-ibm-blue transition-colors">API Reference</a></li>
            </ul>
          </div>

          {/* Social / Support */}
          <div>
            <h3 className="text-xs font-black text-ibm-gray uppercase tracking-widest mb-5">Connect</h3>
            <ul className="space-y-3 text-sm font-bold text-gray-400">
              <li>
                <a href="https://github.com/yourusername/anbu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-ibm-blue transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://cloud.ibm.com/watsonx" target="_blank" rel="noopener noreferrer" className="hover:text-ibm-blue transition-colors">
                  IBM Watsonx AI
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-50 gap-4">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
            © {currentYear} ANBU SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Status: <span className="text-green-400">All Systems Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
