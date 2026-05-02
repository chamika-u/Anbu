import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 py-16 no-print">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-black">A</span>
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tighter">Anbu.</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Synthesizing complex engineering knowledge into actionable intelligence. 
              Powered by IBM watsonx for the modern developer workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-16">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ecosystem</h4>
              <ul className="space-y-3">
                <li><a href="https://github.com/chamika-u/Anbu" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors">GitHub Source</a></li>
                <li><a href="https://cloud.ibm.com/watsonx" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors">watsonx Engine</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Connect</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-slate-900 text-xs font-bold transition-colors">API Reference</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © {currentYear} Anbu Intelligence Suite. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
               State of the art
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// Made with Bob
