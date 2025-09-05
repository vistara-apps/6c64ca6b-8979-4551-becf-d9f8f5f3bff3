'use client';

import { useEffect, useRef } from 'react';
import { Network, NetworkConnection } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NetworkVisualizationProps {
  networks: Network[];
  connections: NetworkConnection[];
  centerNode?: {
    label: string;
    icon: string;
  };
}

export function NetworkVisualization({
  networks,
  connections,
  centerNode = { label: 'Nexus Hub', icon: '🌐' },
}: NetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw connections (lines from center to networks)
    connections.forEach((connection, index) => {
      const network = networks.find(n => n.networkId === connection.networkId);
      if (!network) return;

      const angle = (index / connections.length) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      
      // Set line style based on connection status
      if (connection.status === 'online') {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else if (connection.status === 'pending') {
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
      } else {
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw network node
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = network.color || '#6b7280';
      ctx.fill();
      
      // Draw network icon (simplified as text)
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(network.icon || '?', x, y);
    });

    // Draw center node
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    
    // Draw center icon
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centerNode.icon, centerX, centerY);

    // Add pulsing animation for active connections
    let animationId: number;
    const animate = () => {
      // This would contain animation logic for pulsing effects
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [networks, connections, centerNode]);

  return (
    <div className="relative w-full h-64 bg-slate-800/30 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay with network labels */}
      <div className="absolute inset-0 pointer-events-none">
        {connections.map((connection, index) => {
          const network = networks.find(n => n.networkId === connection.networkId);
          if (!network) return null;

          const angle = (index / connections.length) * 2 * Math.PI;
          const radius = 70; // Percentage of container
          const x = 50 + Math.cos(angle) * radius;
          const y = 50 + Math.sin(angle) * radius;

          return (
            <div
              key={connection.connectionId}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="text-xs text-gray-400 text-center mt-8">
                {network.name}
              </div>
            </div>
          );
        })}
        
        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-xs text-gray-400 text-center mt-12">
            {centerNode.label}
          </div>
        </div>
      </div>
    </div>
  );
}
