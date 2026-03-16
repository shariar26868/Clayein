export default function KPICard({ label, value, note, color = 'var(--acc)' }) {
  return (
    <div className="kpi" style={{ '--kpi-color': color }}>
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val">{value}</div>
      {note && <div className="kpi-note">{note}</div>}
    </div>
  );
}