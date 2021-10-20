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
  res.redirect('/admin');
});

// Manager Routes
app.get('/admin', managerRoutes.schedule);
app.get('/admin/prev-week', managerRoutes.prevWeekNav);
app.get('/admin/next-week', managerRoutes.nextWeekNav);
app.get('/admin/today', managerRoutes.todayNav);

// Waiter Routes
app.get('/:waiter_id/schedule', waiterRoutes.schedule);
app.get('/:waiter_id/add', waiterRoutes.selectShifts);
app.post('/:waiter_id/add', waiterRoutes.saveShifts);
app.get('/schedule/prev-week', waiterRoutes.prevWeekNav);
app.get('/schedule/next-week', waiterRoutes.nextWeekNav);
app.get('/today', waiterRoutes.todayNav);
app.get('/:waiter_id', waiterRoutes.home);

const PORT = process.env.PORT || 2305;
app.listen(PORT, () => {
  console.log(`App starting on port ${PORT}`);
});
