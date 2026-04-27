import { useState, useEffect } from 'react';

const EMPTY = { title: '', assignee: '', deadline: '', priority: 'High', status: 'To Do' };

export default function TaskForm({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...EMPTY });
  }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{initial ? 'Edit Task' : 'Add New Task'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">
          <div className="form-group full">
            <label>Task Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Task title" />
          </div>
          <div className="form-group">
            <label>Assigned Employee</label>
            <input value={form.assignee} onChange={e => set('assignee', e.target.value)} placeholder="Employee name" />
          </div>
          <div className="form-group">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={form.priority} onChange={e => set('priority', e.target.value)}>
              {['High', 'Medium', 'Low'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group full">
            <label>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {['To Do', 'In Progress', 'Done'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="form-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Task</button>
        </div>
      </div>
    </div>
  );
}