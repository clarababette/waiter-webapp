import moment from 'moment';
export default function managerRoutes(waiterService) {
  function formatDate(date) {
    return moment(date).format('dddd DD MMMM');
  }

  async function getWaiters(day) {
    const schedWaiters = await waiterService.getShiftWaiters(day.date);
    let working = schedWaiters.filter(
      (waiter) => waiter['status'] == 'working',
    );
    let standby = schedWaiters.filter(
      (waiter) => waiter['status'] == 'standby',
    );
    let restWaiters = await waiterService.getAllWaiters();

    function available(waiter) {
      if (
        schedWaiters.some((x) => x['employee_id'] === waiter['employee_id'])
      ) {
        return false;
      }
      return true;
    }

    restWaiters = restWaiters.filter((waiter) => available(waiter));

    day['working'] = working;
    day['standby'] = standby;
    day['available'] = restWaiters;
    day['status'] = '';
    if (working.length == 3 && standby.length > 0) {
      day['status'] = 'full-w-standby';
    } else if (working.length == 3) {
      day['status'] = 'full';
    }

    return day;
  }

  async function schedule(req, res) {
    if (!req.session.nav) {
      req.session.nav = 0;
    }
    const week = req.session.nav;
    let backToToday = '';
    if (week < 0) {
      backToToday = 'Return to this week →';
    } else if (week > 0) {
      backToToday = '← Return to this week';
    }
    let thisWeek = [];
    let navDates = '';
    let today = new Date();
    today.setDate(today.getDate() + week * 7);

    let i = 0;
    while (i < 7) {
      let day = new Date(today.valueOf());
      day.setDate(day.getDate() + i);
      let shift = {date: day};
      shift = await getWaiters(shift);
      switch (i) {
        case 1:
          navDates = `${moment(shift.date).format('DD MMMM')} - `;
          break;
        case 6:
          navDates = navDates + moment(shift.date).format('DD MMMM');
          break;
        default:
          break;
      }
      shift.date = shift.date.toISOString();
      shift['dateString'] = formatDate(shift.date);
      thisWeek.push(shift);
      i++;
    }
    res.render('manager', {
      day: thisWeek,
      week: navDates,
      backToToday: backToToday,
    });
  }

  function prevWeekNav(req, res) {
    req.session.nav--;
    res.redirect(`/admin`);
  }

  function nextWeekNav(req, res) {
    req.session.nav++;
    res.redirect(`/admin`);
  }

  function todayNav(req, res) {
    req.session.nav = 0;
    res.redirect(`/admin`);
  }

  async function removeWaiter(req, res) {
    console.log(req.params);
    const waiterID = req.params.waiter_id;
    const status = req.params.status;
    const date = moment(req.params.date).format('YYYY-MM-DD');

    await waiterService.deleteShift(waiterID, date);
    if (status === 'working') {
      await waiterService.moveStandbyToShift(date);
    }

    res.redirect('/admin');
  }

  async function addWaiter(req, res) {
    const waiterID = req.body['admin-add'];
    const date = req.params.date;
    await waiterService.addShift(date, waiterID);
    res.redirect('/admin');
  }

  async function editShift(req, res) {
    const date = req.params.date;
    const actions = req.query;
    for (let waiter in actions) {
      if (typeof actions[waiter] == 'object') {
        if (actions[waiter].length % 2 === 0) {
          delete actions[waiter];
        } else {
          actions[waiter] = actions[waiter][actions[waiter].length - 1];
        }
      }
      if (actions[waiter] === 'delete') {
        await waiterService.deleteShift(waiter, date);
      }
      if (actions[waiter] === 'add') {
        await waiterService.addShift(date, waiter);
      }
    }
    res.redirect('/admin');
  }

  return {
    schedule,
    prevWeekNav,
    nextWeekNav,
    todayNav,
    removeWaiter,
    addWaiter,
    editShift,
  };
}
