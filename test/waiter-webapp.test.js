import assert, {strictEqual} from 'assert';
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
  it('should schedule a waiter to work on the requested date if there are fewer than three waiters scheduled.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    assert.strictEqual(
      await waiters.getStatus('DauBla', '2021-11-25'),
      'working',
    );
  });

  it('should put a waiter on standby for the requested date if there are three or more waiters scheduled.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    assert.strictEqual(
      await waiters.getStatus('BenPaf', '2021-11-25'),
      'standby',
    );
  });
  it('should get the dates with status in a waiters schedule.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    await waiters.addShift('2021-11-13', 'BenPaf');
    assert.deepStrictEqual(await waiters.getShiftDates('BenPaf'), [
      {
        shift_date: new Date('2021-11-25'),
        status: 'standby',
      },
      {shift_date: new Date('2021-11-13'), status: 'working'},
    ]);
  });
  it('should get all the waiters with their status scheduled on a specific date.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    const result = await waiters.getShiftWaiters('2021-11-25');
    const expected = [
      {
        employee_id: 'BenPaf',
        first_name: 'Benjy',
        last_name: 'Pafford',
        status: 'standby',
      },
      {
        employee_id: 'TieChe',
        first_name: 'Tiena',
        last_name: 'Chesney',
        status: 'working',
      },
      {
        employee_id: 'JanBaf',
        first_name: 'Janaya',
        last_name: 'Baff',
        status: 'working',
      },
      {
        employee_id: 'DauBla',
        first_name: 'Daune',
        last_name: 'Blann',
        status: 'working',
      },
    ];
    assert.deepStrictEqual(result, expected);
  });
  it('should get the full name of a waiter based on the waiterID.', async () => {
    assert.strictEqual(await waiters.getWaiterName('IlsKin'), 'Ilse King');
  });
  it('should remove a waiter from the schedule for a specific date.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    await waiters.deleteShift('TieChe', '2021-11-25');
    assert.strictEqual(
      await waiters.getStatus('TieChe', '2021-11-25'),
      undefined,
    );
  });

  it('should update the status of the first standby waiter if a working waiter is removed.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    await waiters.deleteShift('TieChe', '2021-11-25');
    assert.strictEqual(
      await waiters.getStatus('BenPaf', '2021-11-25'),
      'working',
    );
  });
  it('should return the status of a waiter for a specific date.', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    await waiters.deleteShift('TieChe', '2021-11-25');
    assert.strictEqual(
      await waiters.getStatus('BenPaf', '2021-11-25'),
      'working',
    );
  });

  it('should add new waiters to the waiters table', async () => {
    const waiterID = await waiters.addWaiter('Sally', 'Kent');
    let allWaiters = await waiters.getAllWaiters();
    allWaiters = allWaiters.map((waiter) => waiter['employee_id']);
    assert.strictEqual(allWaiters.includes(waiterID), true);
  });

  it('should delete all shifts', async () => {
    await waiters.addShift('2021-11-25', 'TieChe');
    await waiters.addShift('2021-11-25', 'JanBaf');
    await waiters.addShift('2021-11-25', 'DauBla');
    await waiters.addShift('2021-11-25', 'BenPaf');
    await waiters.deleteAllShifts();

    const shifts = await pool.query('SELECT * FROM shifts');
    assert.strictEqual(shifts.rowCount, 0);
  });

  after(function () {
    pool.end();
  });
});
