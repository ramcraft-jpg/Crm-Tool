export default function Card({ children, style = {}, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    New: 'badge-new', Contacted: 'badge-contacted', Converted: 'badge-completed',
    Pending: 'badge-pending', 'In Progress': 'badge-inprogress', Completed: 'badge-completed',
    'To Do': 'badge-todo', Done: 'badge-done',
    High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low',
    Meeting: 'badge-meeting', Call: 'badge-call', Event: 'badge-event',
  };
  return <span className={`badge ${map[status] || ''}`}>{status}</span>;
}

export function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}
