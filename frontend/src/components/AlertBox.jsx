export default function AlertBox({ type = 'info', icon, children }) {
  return (
    <div className={`alert ${type}`}>
      <span className="alert-icon">{icon}</span>
      <span>{children}</span>
    </div>
  );
}