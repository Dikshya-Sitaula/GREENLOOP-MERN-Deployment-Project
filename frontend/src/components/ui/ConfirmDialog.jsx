import Modal from './Modal';
import Button from './Button';

// Small yes/no dialog. `danger` styles the confirm button as destructive.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', danger = false, loading = false, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title} size="max-w-md">
      <div className="text-sm leading-relaxed text-ink-muted">{message}</div>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
