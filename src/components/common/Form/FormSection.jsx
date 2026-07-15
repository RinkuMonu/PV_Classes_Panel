const FormSection = ({ title, description, children, className = "" }) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
};

export default FormSection;
