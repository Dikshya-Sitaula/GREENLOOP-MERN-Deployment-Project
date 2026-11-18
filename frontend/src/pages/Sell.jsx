import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createItem, uploadImages } from '../api/items';
import { useMeta } from '../api/meta';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../lib/hooks';
import { EASE } from '../lib/motion';
import Button from '../components/ui/Button';
import TypeStep from '../components/sell/TypeStep';
import PhotosStep from '../components/sell/PhotosStep';
import DetailsStep from '../components/sell/DetailsStep';
import ReviewStep from '../components/sell/ReviewStep';

const STEPS = ['Type', 'Photos', 'Details', 'Review'];

function validateDetails(f) {
  const e = {};
  if (f.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
  if (!f.category) e.category = 'Choose a category';
  if (!f.condition) e.condition = 'Choose a condition';
  if (f.type === 'sell' && !(Number(f.price) > 0)) e.price = 'Set a price for items you want to sell';
  if (f.description.trim().length < 10) e.description = 'Add at least 10 characters';
  return e;
}

export default function Sell() {
  usePageTitle('List an item');
  const meta = useMeta();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [errors, setErrors] = useState({});
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({ type: '', title: '', category: '', condition: '', city: user?.city || 'Kathmandu', price: '', wantInReturn: '', wantedCategory: '', wantedNote: '', description: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function next() {
    if (step === 0 && !form.type) return toast.error('Choose how you want to pass it on');
    if (step === 1 && !photos.length) return toast.error('Add at least one photo');
    if (step === 2) {
      const e = validateDetails(form);
      setErrors(e);
      if (Object.keys(e).length) return undefined;
    }
    return setStep((s) => s + 1);
  }

  async function publish() {
    setPublishing(true);
    try {
      const { urls } = await uploadImages(photos.map((p) => p.file));
      const item = await createItem({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.type === 'sell' ? Number(form.price) : 0,
        images: urls,
      });
      toast.success('Your item is live');
      navigate(`/items/${item._id}`);
    } catch (err) {
      toast.error(err.message);
      setPublishing(false);
    }
  }

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <div className="site-container max-w-3xl">
        <p className="eyebrow">List an item</p>
        <ol className="mt-4 flex items-center gap-2" aria-label="Progress">
          {STEPS.map((label, i) => (
            <li key={label} className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-line">
                <motion.div className="h-full rounded-full bg-forest-700" animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: 0.5, ease: EASE }} />
              </div>
              <span className={`mt-2 block text-xs font-medium ${i === step ? 'text-ink' : 'text-ink-muted'}`} aria-current={i === step ? 'step' : undefined}>
                <span className="num">{i + 1}.</span> {label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } }} exit={{ opacity: 0, x: -24, transition: { duration: 0.15 } }}>
              {step === 0 && <TypeStep value={form.type} onChange={(type) => setForm((f) => ({ ...f, type }))} types={meta?.types} />}
              {step === 1 && <PhotosStep photos={photos} onChange={setPhotos} />}
              {step === 2 && <DetailsStep form={form} set={set} errors={errors} meta={meta} />}
              {step === 3 && <ReviewStep form={form} photos={photos} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)} className={step === 0 ? 'invisible' : ''} disabled={publishing}>
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Back
          </Button>
          {step < 3 ? (
            <Button onClick={next}>Continue <ArrowRight className="h-4 w-4" strokeWidth={1.5} /></Button>
          ) : (
            <Button variant="accent" size="lg" onClick={publish} loading={publishing}>Publish listing</Button>
          )}
        </div>
      </div>
    </section>
  );
}
