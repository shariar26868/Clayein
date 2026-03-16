import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function TrendChart({ snapshots = [] }) {
  if (snapshots.length < 2) return (
    <div className="card" style={{ textAlign: 'center', color: 'var(--muted2)', padding: 32 }}>
      Save at least 2 monthly snapshots to see the trend chart.
    </div>
  );

  const labels   = snapshots.map(s => `${MONTHS[s.month - 1]} ${s.year}`);
  const revenues = snapshots.map(s => s.data?.revenue  || 0);
  const profits  = snapshots.map(s => s.data?.profit   || 0);
  const expenses = snapshots.map(s => s.data?.expenses || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenues,
        borderColor: '#6db8fa',
        backgroundColor: 'rgba(109,184,250,0.06)',
        tension: 0.4, fill: true, pointRadius: 4,
      },
      {
        label: 'Profit',
        data: profits,
        borderColor: '#4dffa0',
        backgroundColor: 'rgba(77,255,160,0.06)',
        tension: 0.4, fill: true, pointRadius: 4,
      },
      {
        label: 'Expenses',
        data: expenses,
        borderColor: '#ff5f6d',
        backgroundColor: 'rgba(255,95,109,0.04)',
        tension: 0.4, fill: false, pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: '#8888a8', font: { family: 'JetBrains Mono', size: 11 } } } },
    scales: {
      x: { ticks: { color: '#5a5a72', font: { size: 11 } }, grid: { color: '#252538' } },
      y: {
        ticks: {
          color: '#5a5a72', font: { size: 11 },
          callback: v => '৳' + v.toLocaleString('en-IN'),
        },
        grid: { color: '#252538' },
      },
    },
  };

  return (
    <div className="card">
      <div className="card-ttl"><span className="dot" style={{ '--dc': 'var(--blue)' }} />Monthly Trend</div>
      <Line data={data} options={options} />
    </div>
  );
}