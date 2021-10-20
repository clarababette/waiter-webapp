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

await waiterRoutes.shiftAvailability(['2021-11-21'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-14'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-10-22'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-28'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-11-21'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-11-25'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-10-20'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-10-24'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-28'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-11-04'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-31'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-11-23'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-19'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-11-06'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-30'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-11'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-09'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-11-25'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-10-31'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-11-10'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-05'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-11-11'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-11-26'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-11-07'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-10'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-10-25'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-11-11'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-25'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-06'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-08'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-10-20'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-11-03'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-11-15'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-28'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-10-29'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-11-27'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-11-05'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-11-19'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-15'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-29'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-27'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-11-22'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'IngMat');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-07'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-11-13'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-10-19'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-29'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-11-08'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-11-06'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-11-02'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-11-25'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-10-31'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-19'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-11-28'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-30'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-17'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-24'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-10-29'], 'HueSha');
await waiterRoutes.shiftAvailability(['2021-10-19'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-28'], 'SarBal');
await waiterRoutes.shiftAvailability(['2021-10-27'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-11-15'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-11-08'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-27'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-03'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-10-24'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-24'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-11-27'], 'PamFot');
await waiterRoutes.shiftAvailability(['2021-10-29'], 'CleCud');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'CecSta');
await waiterRoutes.shiftAvailability(['2021-11-04'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-10-19'], 'DamFol');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-11-03'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-11-13'], 'HalMed');
await waiterRoutes.shiftAvailability(['2021-10-26'], 'EupHev');
await waiterRoutes.shiftAvailability(['2021-10-20'], 'CarAro');
await waiterRoutes.shiftAvailability(['2021-10-23'], 'IngMat');
