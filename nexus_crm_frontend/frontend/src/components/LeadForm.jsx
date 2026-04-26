import { useState, useEffect } from 'react';

const EMPTY = { name: '', company: '', email: '', phone: '', source: 'Website', status: 'New', notes: '' };

export default function LeadForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...EMPTY });
  }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Edit Lead' : 'Add New Lead'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Customer Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company name" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@company.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 00000 00000" />
          </div>
          <div className="form-group">
            <label>Lead Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value)}>
              {['Website', 'Referral', 'Social Media', 'Cold Call', 'Email Campaign', 'Trade Show'].map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Lead Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {['New', 'Contacted', 'Converted'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes..." />
          </div>
        </div>

        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Lead</button>
        </div>
      </div>
    </div>
  );
}
