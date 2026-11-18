import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useMeta } from '../api/meta';
import { usePageTitle } from '../lib/hooks';
import { firstName } from '../lib/format';

export default function Register() {
  usePageTitle('Join GreenLoop');
  const { user, register } = useAuth();
  const meta = useMeta();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', city: 'Kathmandu' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.password.length < 8) next.password = 'Use at least 8 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const u = await register(form);
      toast.success(`Welcome to GreenLoop, ${firstName(u.name)}`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const fieldErrors = Object.fromEntries((err.fields || []).map((f) => [f.field, f.message]));
      setErrors(fieldErrors);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Join the loop"
      subtitle="Give things another life — and see the difference it makes."
      footer={
        <>
          Already a member?{' '}
          <Link to="/login" className="font-medium text-forest-700 underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Full name" autoComplete="name" placeholder="Aarati Shrestha" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} error={errors.password} />
        <Field label="City" as="select" value={form.city} onChange={set('city')} error={errors.city}>
          {(meta?.cities || [form.city]).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
