export default function waiterService(pool) {
  async function getShiftDates(waiterID) {
    const result = await pool.query(
      'SELECT shift_date FROM shifts WHERE employee_id = $1',
      [waiterID],
    );
    return result.rows;
  }

  async function getStandbyDates(waiterID) {
    const result = await pool.query(
      'SELECT standby_shift_date FROM standby WHERE employee_id = $1',
      [waiterID],
    );
    return result.rows;
  }

  async function getShiftWaiters(date) {
    const result = await pool.query(
      'SELECT * FROM shifts INNER JOIN waiters ON waiters.employee_id = shifts.employee_id WHERE shift_date = $1',
      [date],
    );
    return result.rows;
  }

  async function getStandbyWaiters(date) {
    const result = await pool.query(
      'SELECT * FROM standby INNER JOIN waiters ON waiters.employee_id = standby.employee_id WHERE standby_shift_date = $1',
      [date],
    );
    return result.rows;
  }

  async function addShift(date, waiterID) {
    await pool.query(
      'INSERT INTO shifts (shift_date, employee_id) VALUES ($1,$2) ON CONFLICT DO NOTHING;',
      [date, waiterID],
    );
  }

  async function addStandby(date, waiterID) {
    await pool.query(
      'INSERT INTO standby (standby_shift_date, employee_id) VALUES ($1,$2) ON CONFLICT DO NOTHING;',
      [date, waiterID],
    );
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

  async function deleteShift() {}

  async function deleteStandby() {}

  async function moveStandbytoShift() {}

  return {
    getShiftDates,
    getStandbyDates,
    getShiftWaiters,
    getStandbyWaiters,
    addShift,
    addStandby,
    deleteShift,
    deleteStandby,
    moveStandbytoShift,
    getWaiterName,
  };
}
