export const fmt  = n => '৳' + Math.abs(Math.round(n ?? 0)).toLocaleString('en-IN');
export const pct  = n => (n ?? 0).toFixed(1) + '%';
export const sign = n => (n >= 0 ? '+' : '−') + fmt(n);