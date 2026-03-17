// export default function KPICard({ label, value, note, color = 'var(--acc)' }) {
//   return (
//     <div className="kpi" style={{ '--kpi-color': color }}>
//       <div className="kpi-lbl">{label}</div>
//       <div className="kpi-val">{value}</div>
//       {note && <div className="kpi-note">{note}</div>}
//     </div>
//   );
// }




export default function KPICard({ label, value, note, color, glow }) {
  return (
    <div className="kpi" style={{ '--kpi-color': color || 'var(--grad-text)', '--kpi-glow': glow || 'rgba(124,58,237,0.5)' }}>
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val">{value}</div>
      {note && <div className="kpi-note">{note}</div>}
    </div>
  );
}