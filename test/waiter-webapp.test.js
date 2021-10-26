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
    const expected = [
      {first_name: 'Dave', last_name: 'Avramov', employee_id: 'DavAvr'},
      {first_name: 'Ilse', last_name: 'King', employee_id: 'IlsKin'},
      {first_name: 'Benjy', last_name: 'Pafford', employee_id: 'BenPaf'},
      {first_name: 'Amelie', last_name: 'Loidl', employee_id: 'AmeLoi'},
      {
        first_name: 'Karlene',
        last_name: 'Maciaszek',
        employee_id: 'KarMac',
      },
      {first_name: 'Tiena', last_name: 'Chesney', employee_id: 'TieChe'},
      {first_name: 'Janaya', last_name: 'Baff', employee_id: 'JanBaf'},
      {first_name: 'Jean', last_name: 'Guillotin', employee_id: 'JeaGui'},
      {first_name: 'Daune', last_name: 'Blann', employee_id: 'DauBla'},
      {
        first_name: 'Alessandra',
        last_name: 'Tale',
        employee_id: 'AleTal',
      },
    ];
    const result = await waiters.getAllWaiters();
    assert.deepStrictEqual(result, expected);
  });

  after(function () {
    pool.end();
  });
});
