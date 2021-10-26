import assert from 'assert';
import waiterService from '../waiter-services.js';
import pg from 'pg';
const Pool = pg.Pool;

const connectionString =
  'postgresql://localhost:5433/waiter_tests' ||
  'postgresql://localhost:5432/waiter_tests';

const pool = new Pool({
  connectionString,
});

const waiters = waiterService(pool);

describe('The Waiter Scheduling app', () => {
  beforeEach(async function () {
    await pool.query('delete from shifts;');
  });

  it('should get names and employee ids of all waiters.', async () => {
    const expected = [];
    const result = await waiters.getAllWaiters();
    console.log(result);
    assert.deepStrictEqual(result, expected);
  });

  after(function () {
    pool.end();
  });
});
