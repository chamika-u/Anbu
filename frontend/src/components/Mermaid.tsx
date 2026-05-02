import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'IBM Plex Sans, sans-serif'
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      try {
        setError(false);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgCode(svg);
      } catch (err) {
        console.error('Mermaid rendering failed', err);
        setError(true);
      }
    };

    if (chart) {
      renderChart();
    }
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
