const Shimmer = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-6xl font-bold text-gray-800 relative">
        <span className="relative inline-block">
          <span className="opacity-30">1</span>
          <span className="absolute inset-0 bg-current opacity-10 animate-pulse"></span>
        </span>
        
        <span className="mx-1">/</span>
        
        <span className="relative inline-block">
          <span className="opacity-30">2</span>
          <span className="absolute inset-0 bg-current opacity-10 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
        </span>
      </div>
    </div>
  );
};

export default Shimmer;