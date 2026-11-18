import { useId } from 'react';

// Label + control + error message. Pass `as="textarea"` or `as="select"` for other controls.
export default function Field({ label, error, hint, as = 'input', className = '', children, ...props }) {
  const id = useId();
  const Control = as;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <Control
        id={id}
        className={`input ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${as === 'textarea' ? 'min-h-[120px] resize-y' : ''}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Control>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
