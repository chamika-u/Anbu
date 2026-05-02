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
                theme: 'default',
                securityLevel: 'loose',
                fontFamily: 'IBM Plex Sans, sans-serif'
              });
              resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Mermaid JS'));
            document.head.appendChild(script);
          });
        }

        const mermaid = (window as any).mermaid;
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
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
      <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-mono overflow-auto">
        <strong>Diagram rendering error:</strong><br />
        <pre className="mt-2">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-wrapper flex justify-center my-6 overflow-x-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100"
      dangerouslySetInnerHTML={{ __html: svgCode }} 
    />
  );
};

export default Mermaid;
