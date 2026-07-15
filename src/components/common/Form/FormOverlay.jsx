const FormOverlay = ({ children, className = "" }) => {
  return (
    <div className={`fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${className}`}>
      {children}
    </div>
  );
};

export default FormOverlay;
