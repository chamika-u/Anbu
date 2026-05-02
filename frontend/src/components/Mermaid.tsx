import React, { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        setError(false);
        
        // Dynamically load Mermaid from CDN to bypass npm network issues
        if (!(window as any).mermaid) {
          await new Promise<void>((resolve, reject) => {
            if (document.getElementById('mermaid-script')) {
              const checkInterval = setInterval(() => {
                if ((window as any).mermaid) {
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 100);
              return;
            }

            const script = document.createElement('script');
            script.id = 'mermaid-script';
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
            script.onload = () => {
              const m = (window as any).mermaid;
              m.initialize({
                startOnLoad: false,
                theme: 'neutral',
                securityLevel: 'loose',
                fontFamily: 'IBM Plex Sans, sans-serif',
                themeVariables: {
                  primaryColor: '#0f62fe',
                  primaryTextColor: '#fff',
                  primaryBorderColor: '#0f62fe',
                  lineColor: '#8d8d8d',
                  secondaryColor: '#e0e0e0',
                  tertiaryColor: '#f4f4f4'
                }
              });
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Mermaid JS'));
            document.head.appendChild(script);
          });
        }

        const mermaid = (window as any).mermaid;
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvgCode(svg);
        }
      } catch (err) {
        console.error('Mermaid rendering failed', err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-6 border border-red-100 bg-red-50 text-red-600 rounded-2xl text-xs font-bold font-mono overflow-auto flex items-center gap-3">
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
        Diagram rendering failed. Review your architecture source.
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-wrapper flex justify-center my-8 overflow-x-auto p-8 bg-white rounded-3xl border border-gray-100/50 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svgCode }} 
    />
  );

  );
};

export default Mermaid;
