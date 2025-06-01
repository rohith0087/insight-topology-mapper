
import React, { useState, useEffect } from 'react';

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
      
      <div className="text-slate-400">
        Nodes: <span className="text-cyan-400 font-medium">{nodeCount}</span>
      </div>
      
      <div className="text-slate-400">
        Connections: <span className="text-cyan-400 font-medium">{connectionCount}</span>
      </div>
      
      <div className="text-slate-400">
        {currentTime.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StatusBar;
