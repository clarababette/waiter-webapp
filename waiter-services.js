export default function waiterService(pool) {
  async function getShiftDates(waiterID) {
    const result = await pool.query(
      'SELECT shift_date, status FROM shifts WHERE employee_id = $1',
      [waiterID],
    );
    return result.rows;
  }

  async function getShiftWaiters(date) {
    const result = await pool.query(
      'SELECT shifts.employee_id, first_name, last_name, status FROM shifts INNER JOIN waiters ON waiters.employee_id = shifts.employee_id WHERE shift_date = $1',
      [date],
    );
    return result.rows;
  }

  async function addShift(date, waiterID) {
    const workCount = await pool.query(
      'SELECT * FROM shifts WHERE shift_date = $1 AND status=$2',
      [date, 'working'],
    );

    if (workCount.rowCount < 3) {
      await pool.query(
        'INSERT INTO shifts (shift_date, employee_id, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;',
        [date, waiterID, 'working'],
      );
    } else {
      await pool.query(
        'INSERT INTO shifts (shift_date, employee_id, status) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING;',
        [date, waiterID, 'standby'],
      );
    }
  }

  async function getWaiterName(waiterID) {
    const result = await pool.query(
      'SELECT first_name, last_name FROM waiters WHERE employee_id = $1',
      [waiterID],
    );
    if (result.rows[0]) {
      return `${result.rows[0].first_name} ${result.rows[0].last_name}`;
    }
  }

  async function deleteShift(waiterID, date) {
    await pool.query(
      'DELETE FROM shifts WHERE employee_id = $1 AND shift_date = $2',
      [waiterID, date],
    );
    const workCount = await pool.query(
      'SELECT * FROM shifts WHERE shift_date = $1 AND status=$2',
      [date, 'working'],
    );
    if (workCount.rowCount < 3) {
      await moveStandbyToShift(date);
    }
  }

  async function moveStandbyToShift(date) {
    const firstStandby = await pool.query(
      'SELECT employee_id FROM shifts WHERE shift_date = $1 AND status= $2 LIMIT 1',
      [date, 'standby'],
    );

    if (firstStandby.rows[0].employee_id) {
      await pool.query(
        'UPDATE shifts SET status = $1 WHERE shift_date = $2 AND employee_id = $3',
        ['working', date, firstStandby.rows[0].employee_id],
      );
    }
  }

  async function getAllWaiters() {
    const result = await pool.query('SELECT * FROM waiters');
    return result.rows;
  }

  async function getStatus(waiterID, date) {
    const result = await pool.query(
      'SELECT status FROM shifts WHERE employee_id = $1 AND shift_date = $2',
      [waiterID, date],
    );
    if (result.rows[0]) {
      return result.rows[0].status;
    }
  }
  return {
    getShiftDates,
    getShiftWaiters,
    addShift,
    deleteShift,
    moveStandbyToShift,
    getWaiterName,
    getAllWaiters,
    getStatus,
  };
}
