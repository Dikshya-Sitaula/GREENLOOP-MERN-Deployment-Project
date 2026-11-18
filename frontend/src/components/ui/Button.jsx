import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  accent: 'bg-marigold text-ink hover:bg-marigold-600 shadow-[0_1px_0_rgba(18,24,21,0.08)]',
  primary: 'bg-forest-700 text-white hover:bg-forest-500',
  outline: 'border border-line bg-surface text-ink hover:border-ink/30 hover:bg-paper',
  'outline-light': 'border border-white/25 text-white hover:bg-white/10 hover:border-white/40',
  ghost: 'text-ink hover:bg-ink/5',
  danger: 'bg-error text-white hover:bg-error/90',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

const MotionLink = motion.create(Link);

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, loading = false, className = '', children, disabled, ...rest },
  ref
) {
  const classes = `inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const press = disabled || loading ? {} : { whileTap: { scale: 0.97 } };
  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} aria-hidden />}
      {children}
    </>
  );

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} {...press} {...rest}>
        {content}
      </MotionLink>
    );
  }
  if (href) {
    return (
      <motion.a ref={ref} href={href} className={classes} {...press} {...rest}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button ref={ref} className={classes} disabled={disabled || loading} {...press} {...rest}>
      {content}
    </motion.button>
  );
});

export default Button;
