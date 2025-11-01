interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className = "" }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 ${className}`} role="alert">
      {error}
    </div>
  );
}
