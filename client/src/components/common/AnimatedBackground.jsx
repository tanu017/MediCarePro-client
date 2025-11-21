import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-10 sm:top-20 left-2 sm:left-10 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-32 sm:top-40 lg:top-90 left-16 sm:left-24 lg:left-120 w-16 sm:w-24 lg:w-36 h-16 sm:h-24 lg:h-36 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-20 sm:top-40 right-8 sm:right-16 lg:right-160 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-2 sm:bottom-5 right-8 sm:right-16 lg:right-170 w-20 sm:w-32 lg:w-40 h-20 sm:h-32 lg:h-40 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute bottom-8 sm:bottom-20 right-2 sm:right-10 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-blue-300 rounded-full opacity-5 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-gradient-radial from-blue-500/20 to-transparent rounded-full"></div>
    </div>
  );
};

export default AnimatedBackground;
