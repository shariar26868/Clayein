// require('dotenv').config();
// const express   = require('express');
// const cors      = require('cors');
// const connectDB = require('./db');

// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());

// app.use('/api/admin',     require('./routes/admin'));
// app.use('/api/products',  require('./routes/products'));
// app.use('/api/investor',  require('./routes/investor'));
// app.use('/api/snapshots', require('./routes/snapshots'));

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({ error: err.message || 'Server error' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`BizTrack running on :${PORT} 🚀`));

require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./routes/adminAuth'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/investor',  require('./routes/investor'));
app.use('/api/snapshots', require('./routes/snapshots'));
app.use('/api/ai',        require('./routes/ai'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BizTrack running on :${PORT} 🚀`));