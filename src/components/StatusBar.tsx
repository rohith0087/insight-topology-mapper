
import React, { useState, useEffect } from 'react';
import { Monitor, Link, Clock } from 'lucide-react';

const StatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nodeCount] = useState(247);
  const [connectionCount] = useState(1584);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-6 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-slate-300">Live</span>
      </div>
      
      <div className="flex items-center space-x-2 text-slate-400">
        <Monitor className="w-4 h-4 text-cyan-400" />
        <span>Nodes: <span className="text-cyan-400 font-medium">{nodeCount}</span></span>
      </div>
      
      <div className="flex items-center space-x-2 text-slate-400">
        <Link className="w-4 h-4 text-green-400" />
        <span>Connections: <span className="text-cyan-400 font-medium">{connectionCount}</span></span>
      </div>
      
      <div className="flex items-center space-x-2 text-slate-400">
        <Clock className="w-4 h-4 text-slate-400" />
        <span>{currentTime.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default StatusBar;
