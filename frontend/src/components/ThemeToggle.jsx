export default function ThemeToggle() {
  const toggle = () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') !== 'light';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const isLight = () => document.documentElement.getAttribute('data-theme') === 'light';

  return (
    <button
      onClick={toggle}
      title="Toggle theme"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 10,
        padding: '7px 12px',
        cursor: 'pointer',
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: 'var(--muted)',
        fontFamily: 'inherit',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
    >
      <span id="theme-icon">{isLight() ? '🌙' : '☀️'}</span>
    </button>
  );
}