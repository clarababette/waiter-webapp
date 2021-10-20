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
    await shiftAvailability(['2021-11-21'], 'CarAro');
    await shiftAvailability(['2021-11-21'], 'CarAro');
    await shiftAvailability(['2021-11-21'], 'CarAro');
    await shiftAvailability(['2021-11-14'], 'CecSta');
    await shiftAvailability(['2021-10-22'], 'CleCud');
    await shiftAvailability(['2021-10-28'], 'CleCud');
    await shiftAvailability(['2021-11-21'], 'HueSha');
    await shiftAvailability(['2021-11-25'], 'CecSta');
    await shiftAvailability(['2021-10-20'], 'HueSha');
    await shiftAvailability(['2021-10-24'], 'CarAro');
    await shiftAvailability(['2021-11-17'], 'DamFol');
    await shiftAvailability(['2021-10-28'], 'PamFot');
    await shiftAvailability(['2021-11-04'], 'CleCud');
    await shiftAvailability(['2021-10-31'], 'PamFot');
    await shiftAvailability(['2021-10-23'], 'SarBal');
    await shiftAvailability(['2021-10-23'], 'DamFol');
    await shiftAvailability(['2021-11-23'], 'SarBal');
    await shiftAvailability(['2021-10-26'], 'EupHev');
    await shiftAvailability(['2021-11-19'], 'CleCud');
    await shiftAvailability(['2021-11-06'], 'HueSha');
    await shiftAvailability(['2021-11-17'], 'DamFol');
    await shiftAvailability(['2021-10-30'], 'CarAro');
    await shiftAvailability(['2021-11-11'], 'CecSta');
    await shiftAvailability(['2021-11-09'], 'PamFot');
    await shiftAvailability(['2021-11-25'], 'EupHev');
    await shiftAvailability(['2021-10-31'], 'HueSha');
    await shiftAvailability(['2021-11-10'], 'CecSta');
    await shiftAvailability(['2021-11-05'], 'HalMed');
    await shiftAvailability(['2021-11-17'], 'SarBal');
    await shiftAvailability(['2021-11-11'], 'IngMat');
    await shiftAvailability(['2021-11-26'], 'CleCud');
    await shiftAvailability(['2021-11-07'], 'CarAro');
    await shiftAvailability(['2021-11-10'], 'HueSha');
    await shiftAvailability(['2021-10-25'], 'CleCud');
    await shiftAvailability(['2021-11-11'], 'CecSta');
    await shiftAvailability(['2021-11-25'], 'CarAro');
    await shiftAvailability(['2021-11-06'], 'CarAro');
    await shiftAvailability(['2021-11-08'], 'HalMed');
    await shiftAvailability(['2021-10-26'], 'HalMed');
    await shiftAvailability(['2021-10-20'], 'SarBal');
    await shiftAvailability(['2021-10-26'], 'HalMed');
    await shiftAvailability(['2021-11-03'], 'HueSha');
    await shiftAvailability(['2021-11-15'], 'CleCud');
    await shiftAvailability(['2021-10-28'], 'CecSta');
    await shiftAvailability(['2021-10-26'], 'IngMat');
    await shiftAvailability(['2021-10-29'], 'IngMat');
    await shiftAvailability(['2021-11-27'], 'HueSha');
    await shiftAvailability(['2021-11-05'], 'IngMat');
    await shiftAvailability(['2021-11-19'], 'EupHev');
    await shiftAvailability(['2021-11-15'], 'IngMat');
    await shiftAvailability(['2021-10-23'], 'CarAro');
    await shiftAvailability(['2021-11-29'], 'EupHev');
    await shiftAvailability(['2021-11-27'], 'SarBal');
    await shiftAvailability(['2021-11-22'], 'HueSha');
    await shiftAvailability(['2021-10-26'], 'IngMat');
    await shiftAvailability(['2021-11-17'], 'CecSta');
    await shiftAvailability(['2021-11-17'], 'CarAro');
    await shiftAvailability(['2021-11-07'], 'HalMed');
    await shiftAvailability(['2021-11-13'], 'SarBal');
    await shiftAvailability(['2021-10-19'], 'CecSta');
    await shiftAvailability(['2021-11-29'], 'PamFot');
    await shiftAvailability(['2021-11-17'], 'SarBal');
    await shiftAvailability(['2021-11-08'], 'DamFol');
    await shiftAvailability(['2021-11-17'], 'SarBal');
    await shiftAvailability(['2021-11-06'], 'HalMed');
    await shiftAvailability(['2021-10-23'], 'EupHev');
    await shiftAvailability(['2021-10-26'], 'PamFot');
    await shiftAvailability(['2021-11-02'], 'DamFol');
    await shiftAvailability(['2021-11-25'], 'EupHev');
    await shiftAvailability(['2021-10-31'], 'EupHev');
    await shiftAvailability(['2021-11-19'], 'SarBal');
    await shiftAvailability(['2021-11-28'], 'DamFol');
    await shiftAvailability(['2021-10-30'], 'CecSta');
    await shiftAvailability(['2021-11-17'], 'DamFol');
    await shiftAvailability(['2021-10-24'], 'CarAro');
    await shiftAvailability(['2021-10-29'], 'HueSha');
    await shiftAvailability(['2021-10-19'], 'CleCud');
    await shiftAvailability(['2021-10-28'], 'SarBal');
    await shiftAvailability(['2021-10-27'], 'DamFol');
    await shiftAvailability(['2021-11-15'], 'PamFot');
    await shiftAvailability(['2021-11-08'], 'CleCud');
    await shiftAvailability(['2021-10-27'], 'EupHev');
    await shiftAvailability(['2021-11-03'], 'CarAro');
    await shiftAvailability(['2021-10-24'], 'DamFol');
    await shiftAvailability(['2021-10-24'], 'DamFol');
    await shiftAvailability(['2021-11-27'], 'PamFot');
    await shiftAvailability(['2021-10-29'], 'CleCud');
    await shiftAvailability(['2021-10-23'], 'CecSta');
    await shiftAvailability(['2021-11-04'], 'HalMed');
    await shiftAvailability(['2021-10-19'], 'DamFol');
    await shiftAvailability(['2021-10-26'], 'CarAro');
    await shiftAvailability(['2021-11-03'], 'EupHev');
    await shiftAvailability(['2021-11-13'], 'HalMed');
    await shiftAvailability(['2021-10-26'], 'EupHev');
    await shiftAvailability(['2021-10-20'], 'CarAro');
    await shiftAvailability(['2021-10-23'], 'IngMat');
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
