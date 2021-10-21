import moment from 'moment';
export default function managerRoutes(waiterService) {
  function formatDate(date) {
    return moment(date).format('dddd DD MMMM');
  }

  async function getWaiters(day) {
    let working = await waiterService.getShiftWaiters(day.date);
    working = working.map((x) => `${x['first_name']} ${x['last_name']}`);
    day['working'] = working;
    let standby = await waiterService.getStandbyWaiters(day.date);
    standby = standby.map((x) => `${x['first_name']} ${x['last_name']}`);
    day['standby'] = standby;
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
      shift.date = formatDate(shift.date);
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

  return {
    schedule,
    prevWeekNav,
    nextWeekNav,
    todayNav,
  };
}
