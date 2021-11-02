'use strict';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import pg from 'pg';
import waiterService from './waiter-services.js';
import waiterRoute from './waiter-routes.js';
import managerRoute from './manager-routes.js';

const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/waiter_database';

const pool = (() => {
  if (process.env.NODE_ENV !== 'production') {
    return new Pool({
      connectionString: connectionString,
      ssl: false,
    });
  } else {
    return new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
})();

pool.connect();

const app = express();
const service = waiterService(pool);
const waiterRoutes = waiterRoute(service);
const managerRoutes = managerRoute(service);

// HANDLEBARS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.use(
  session({
    secret: 'Proto-mammal and his thoughts are short',
    resave: false,
    saveUninitialized: true,
  }),
);

app.get('/', async (req, res) => {
  res.render('login');
});
app.post('/login', waiterRoutes.login);

// Manager Routes
app.get('/admin', managerRoutes.schedule);
app.get('/admin/prev-week', managerRoutes.prevWeekNav);
app.get('/admin/next-week', managerRoutes.nextWeekNav);
app.get('/admin/today', managerRoutes.todayNav);
app.get('/remove/:status/:date/:waiter_id', managerRoutes.removeWaiter);
app.post('/admin/add/:date', managerRoutes.addWaiter);
app.post('/admin/edit/:date', managerRoutes.editShift);
app.post('/reset', managerRoutes.resetSchedule);

// Waiter Routes
app.get('/waiter/:waiterID/schedule', waiterRoutes.schedule);
app.get('/waiter/:waiterID/add', waiterRoutes.selectShifts);
app.post('/waiter/:waiterID/add', waiterRoutes.saveShifts);
app.get('/waiter/:waiterID/cancel', waiterRoutes.selectCancelShifts);
app.post('/waiter/:waiterID/cancel', waiterRoutes.saveCancelShifts);
app.get('/waiter/:waiterID/prev-week', waiterRoutes.prevWeekNav);
app.get('/waiter/:waiterID/next-week', waiterRoutes.nextWeekNav);
app.get('/waiter/:waiterID/today', waiterRoutes.todayNav);
app.get('/waiter/:waiterID', waiterRoutes.home);

const PORT = process.env.PORT || 2305;
app.listen(PORT, () => {
  console.log(`App starting on port ${PORT}`);
});
