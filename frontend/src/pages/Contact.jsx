import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, MapPin } from 'lucide-react';
import Field from '../components/ui/Field';
import Button from '../components/ui/Button';
import { sendContact } from '../api/community';
import { useMeta } from '../api/meta';
import { usePageTitle } from '../lib/hooks';

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  usePageTitle('Contact');
  const meta = useMeta();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please tell us your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.subject.trim().length < 3) next.subject = 'Add a short subject';
    if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      await sendContact(form);
      toast.success('Thanks — your message is on its way');
      setForm(EMPTY);
    } catch (err) {
      setErrors(Object.fromEntries((err.fields || []).map((f) => [f.field, f.message])));
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-paper pb-24 pt-32 md:pt-40">
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-5xl leading-[1.05] tracking-tightest md:text-6xl">Say hello.</h1>
          <p className="mt-5 max-w-md text-ink-muted">Questions, ideas or a story about something that found a second life? We read everything.</p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-forest-700" strokeWidth={1.5} /> hello@greenloop.demo</li>
            <li className="flex items-center gap-3"><MapPin className="h-5 w-5 text-forest-700" strokeWidth={1.5} /> {(meta?.cities || []).join(' · ')}</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-card border border-line bg-surface p-6 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          </div>
          <Field label="Subject" value={form.subject} onChange={set('subject')} error={errors.subject} />
          <Field label="Message" as="textarea" value={form.message} onChange={set('message')} error={errors.message} />
          <Button type="submit" size="lg" className="w-full sm:w-auto" loading={loading}>Send message</Button>
        </form>
      </div>
    </section>
  );
}
