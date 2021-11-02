import moment from 'moment';
export default function waiterRoutes(waiterService) {
  function formatDate(date) {
    return moment(date).format('dddd DD MMMM YYYY');
  }

  async function getSchedule(waiterID, week) {
    const allDates = await waiterService.getShiftDates(waiterID);
    const shifts = {};
    allDates.forEach(
      (shift) =>
        (shifts[moment(shift['shift_date']).format('YYYY-MM-DD')] =
          shift['status']),
    );
    let startDate = moment();
    if (week < 0) {
      week = week * -1;
      startDate = startDate.subtract(week, 'weeks');
    } else if (week > 0) {
      startDate = startDate.add(week, 'weeks');
    }

    const theseDates = {};
    let i = 0;
    while (i <= 7) {
      let day = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
      theseDates[day] = {};
      if (shifts[day]) {
      }
      theseDates[day]['status'] = shifts[day];

      theseDates[day]['dateName'] = formatDate(day);
      i++;
    }

    return theseDates;
  }

  function getWeek(week) {
    let startDate = moment();
    if (week < 0) {
      week = week * -1;
      startDate = startDate.subtract(week, 'weeks');
    } else if (week > 0) {
      startDate = startDate.add(week, 'weeks');
    }
    return `${startDate.format('dddd DD MMMM YYYY')} - ${startDate
      .add(7, 'days')
      .format('dddd DD MMMM YYYY')}`;
  }

  async function schedule(req, res) {
    if (!req.session.nav) {
      req.session.nav = 0;
    }
    let backToToday = '';
    if (req.session.nav < 0) {
      backToToday = 'Return to this week →';
    } else if (req.session.nav > 0) {
      backToToday = '← Return to this week';
    }
    const waiterID = req.params.waiterID;
    req.session.waiterID = waiterID;

    res.render('waiter-schedule', {
      waiter_name: await waiterService.getWaiterName(waiterID),
      days: await getSchedule(waiterID, req.session.nav),
      week: getWeek(req.session.nav),
      backToToday,
      waiterID: waiterID,
    });
  }

  async function home(req, res) {
    req.session.nav = 0;
    const waiterID = req.params.waiterID;
    req.session.waiterID = waiterID;
    const days = {
      today_date: formatDate(new Date()),
      tomorrow_date: formatDate(moment(new Date()).add(1, 'd')),
    };
    days['today_status'] =
      (await waiterService.getStatus(waiterID, moment())) || 'not working';
    days['tomorrow_status'] =
      (await waiterService.getStatus(waiterID, moment().add(1, 'days'))) ||
      'not working';

    days['waiter_name'] = await waiterService.getWaiterName(
      req.params.waiterID,
    );
    days['waiterID'] = waiterID;
    res.render('waiter-home', days);
  }

  async function selectShifts(req, res) {
    if (!req.session.nav) {
      req.session.nav = 0;
    }
    const waiterID = req.params.waiterID;
    req.session.waiterID = waiterID;
    res.render('waiter-add', {
      waiter_name: await waiterService.getWaiterName(waiterID),
      waiterID: waiterID,
      days: await getSchedule(waiterID, req.session.nav),
    });
  }

  async function shiftAvailability(selectedDates, waiterID) {
    const dates = selectedDates.map((x) => moment(x).format('YYYY-MM-DD'));
    dates.forEach(async (date) => {
      await waiterService.addShift(date, waiterID);
    });
  }

  async function saveShifts(req, res) {
    const waiterID = req.params.waiterID;
    const selected = Object.keys(req.body);
    await shiftAvailability(selected, waiterID);
    res.redirect(`/waiter/${waiterID}/schedule`);
  }

  function prevWeekNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav--;
    res.redirect(`schedule`);
  }

  function nextWeekNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav++;
    res.redirect(`schedule`);
  }

  function todayNav(req, res) {
    const waiterID = req.session.waiter_id;
    req.session.nav = 0;
    res.redirect(`schedule`);
  }

  async function login(req, res) {
    let firstName = req.body.firstName;
    firstName = firstName.trim();
    firstName = [firstName[0].toUpperCase(), ...firstName.slice(1)].join('');
    let surname = req.body.surname;
    surname = surname.trim();
    surname = [surname[0].toUpperCase(), ...surname.slice(1)].join('');
    let waiterID = await waiterService.addWaiter(firstName, surname);
    res.redirect(`/waiter/${waiterID}`);
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
    login,
  };
}
