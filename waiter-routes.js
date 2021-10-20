import moment from 'moment';
export default function waiterRoutes(waiterService) {
  function formatDate(date) {
    return moment(date).format('dddd DD MMMM YYYY');
  }

  async function getStatus(waiterID, date) {
    let shiftDates = await waiterService.getShiftDates(waiterID);

    shiftDates = shiftDates.map((x) => formatDate(x['shift_date']));
    let standbyDates = await waiterService.getStandbyDates(waiterID);
    standbyDates = standbyDates.map((x) => formatDate(x['standby_shift_date']));
    if (shiftDates.includes(date)) {
      return 'working';
    } else if (standbyDates.includes(date)) {
      return 'standby';
    }
  }

  async function getSchedule(waiterID, week) {
    let shiftDates = await waiterService.getShiftDates(waiterID);
    shiftDates = shiftDates.map((x) => formatDate(x['shift_date']));
    let standbyDates = await waiterService.getStandbyDates(waiterID);
    standbyDates = standbyDates.map((x) => formatDate(x['standby_shift_date']));
    let thisWeekDays = {};
    let thisWeek = '';
    let backToToday = '';

    if (week < 0) {
      backToToday = 'Return to this week →';
    } else if (week > 0) {
      backToToday = '← Return to this week';
    }
    let sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay());
    sunday.setDate(sunday.getDate() + week * 7);

    let i = 1;
    while (i < 8) {
      let day = new Date(sunday.valueOf());
      day.setDate(day.getDate() + i);
      day = formatDate(day);
      thisWeekDays[day] = undefined;
      if (shiftDates.includes(day)) {
        thisWeekDays[day] = 'working';
      } else if (standbyDates.includes(day)) {
        thisWeekDays[day] = 'standby';
      }
      switch (i) {
        case 1:
          thisWeek = `${day} - `;
          break;
        case 7:
          thisWeek = thisWeek + day;
          break;
        default:
          break;
      }
      i++;
    }

    return {
      waiter_name: await waiterService.getWaiterName(waiterID),
      waiter_id: waiterID,
      backToToday: backToToday,
      week: thisWeek,
      days: thisWeekDays,
    };
  }

  async function schedule(req, res) {
    if (!req.session.nav) {
      req.session.nav = 0;
    }
    const waiterID = req.params.waiter_id;
    req.session.waiter_id = waiterID;
    res.render('waiter-schedule', await getSchedule(waiterID, req.session.nav));
  }

  async function home(req, res) {
    req.session.nav = 0;
    const waiterID = req.params.waiter_id;
    req.session.waiter_id = waiterID;
    const days = {
      today_date: formatDate(new Date()),
      tomorrow_date: formatDate(moment(new Date()).add(1, 'd')),
    };
    days['today_status'] =
      (await getStatus(waiterID, days['today_date'])) || 'not working';
    days['tomorrow_status'] =
      (await getStatus(waiterID, days['tomorrow_date'])) || 'not working';

    days['waiter_name'] = await waiterService.getWaiterName(
      req.params.waiter_id,
    );
    days['waiter_id'] = waiterID;
    res.render('waiter-home', days);
  }

  async function selectShifts(req, res) {
    if (!req.session.nav) {
      req.session.nav = 0;
    }
    const waiterID = req.params.waiter_id;
    req.session.waiter_id = waiterID;
    const schedule = await getSchedule(waiterID, req.session.nav);
    for (const date in schedule.days) {
      if (moment(new Date(date)).isBefore()) {
        delete schedule.days[date];
      }
    }

    res.render('waiter-add', schedule);
  }

  async function shiftAvailability(selectedDates, waiterID) {
    const dates = selectedDates.map((x) =>
      moment(new Date(x)).format('YYYY-MM-DD'),
    );
    dates.forEach(async (date) => {
      let scheduledWaiters = await waiterService.getShiftWaiters(date);
      scheduledWaiters = scheduledWaiters.length;
      if (scheduledWaiters < 3) {
        await waiterService.addShift(date, waiterID);
      } else {
        await waiterService.addStandby(date, waiterID);
      }
    });
  }

  async function saveShifts(req, res) {
    const waiterID = req.params.waiter_id;
    const selected = Object.keys(req.body);
    await shiftAvailability(selected, waiterID);
    res.redirect(`/${waiterID}/schedule`);
  }

  function prevWeekNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav--;
    res.redirect(`/${waiterID}/schedule`);
  }

  function nextWeekNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav++;
    res.redirect(`/${waiterID}/schedule`);
  }

  function todayNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav = 0;
    res.redirect(`/${waiterID}/schedule`);
  }

  return {
    schedule,
    home,
    selectShifts,
    saveShifts,
    prevWeekNav,
    nextWeekNav,
    todayNav,
    shiftAvailability,
  };
}
