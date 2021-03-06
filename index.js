require('dotenv').config({ path: './.env' });
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const errorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const router = require('./routes/check.route');

const connectDB = require('./utils/DB');
// const { getData } = require('./helpers/getDataBot');
// const { sendNotif } = require('./helpers/sendMessage');

const { sendNotif } = require('./services/telegram.services');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// SECURE APP
app.use(cors());
// app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB(process.env.DB_URI);
  // await sendNotif();

  console.log(`Listening on port ${PORT}`);
});

const cron = require('node-cron');
cron.schedule(
  '15 8,14 * * *',
  async () => {
    console.log('Lets check !!');
    // await sendNotif();
  },
  { scheduled: true, timezone: 'Asia/Bangkok' }
);
