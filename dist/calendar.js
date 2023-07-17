import React from 'react';
import moment from 'moment-jalaali';
import { Button, ButtonGroup, Col, Row, Table } from "react-bootstrap";
import './calendar.css';
class CalendarApp extends React.PureComponent {
  state = {
    uniqueId: null,
    momentInfo: null,
    monthInfo: 0,
    years: [],
    months: [[{
      id: 1,
      selected: false,
      name: 'فروردین'
    }, {
      id: 2,
      selected: false,
      name: 'اردیبهشت'
    }, {
      id: 3,
      selected: false,
      name: 'خرداد'
    }], [{
      id: 4,
      selected: false,
      name: 'تیر'
    }, {
      id: 5,
      selected: false,
      name: 'مرداد'
    }, {
      id: 6,
      selected: false,
      name: 'شهریور'
    }], [{
      id: 7,
      selected: false,
      name: 'ههر'
    }, {
      id: 8,
      selected: false,
      name: 'آبان'
    }, {
      id: 9,
      selected: false,
      name: 'آذر'
    }], [{
      id: 10,
      selected: false,
      name: 'دی'
    }, {
      id: 11,
      selected: false,
      name: 'بهمن'
    }, {
      id: 12,
      selected: false,
      name: 'اسفند'
    }]],
    month: [],
    prevMonth: [],
    nextMonth: [],
    today: null,
    animation: 'animate__fadeIn',
    view: 'day',
    disableNextBtn: false,
    disablePrevBtn: false
  };
  componentDidMount() {
    const {
      value
    } = this.props;
    moment.loadPersian();
    if (value) {
      let m = moment(value, 'jYYYY/jM/jD');
      this.bind(m, true);
    } else {
      let today = moment();
      this.bind(today);
    }
    let now = moment();
    let years = [];
    for (let i = 1345; i < now.jYear(); i++) {
      years.push(i);
    }
    for (let i = now.jYear(); i < now.jYear() + 20; i++) {
      years.push(i);
    }
    this.setState({
      today: now.format('jYYYY/jM/jD'),
      years: years,
      uniqueId: Math.floor(Math.random() * 10000000000000000) + 1
    });
  }
  bind = (date, hasDay = false) => {
    this.setState({
      month: []
    }, () => {
      let month = this.days(date);
      let prevMonth = this.processMonth(date.clone(), true);
      let nextMonth = this.processMonth(date.clone(), false, true);
      this.setState({
        momentInfo: date,
        monthInfo: {
          number: parseInt(date.format('jM')),
          name: date.format('jMMMM'),
          year: parseInt(date.format('jYYYY')),
          day: hasDay ? parseInt(date.format('jD')) : null
        },
        month: month,
        prevMonth: prevMonth,
        nextMonth: nextMonth
      }, () => {
        this.mixer();
      });
    });
  };
  processMonth = (date, isSubtract = false, isAdd = false) => {
    if (isSubtract) {
      const month = date.subtract(1, 'jMonth');
      return this.days(month);
    }
    if (isAdd) {
      const month = date.add(1, 'jMonth');
      return this.days(month);
    }
  };
  weeks = date => {
    let weeks = [];
    let startOfMonth = moment(date).startOf('jMonth');
    let endOfMonth = moment(date).endOf('jMonth');
    for (let day = startOfMonth.jDate(); day <= endOfMonth.jDate(); day++) {
      const findWeekByNumber = weeks.find(x => x.number === startOfMonth.jWeek());
      if (!findWeekByNumber) {
        weeks.push({
          number: startOfMonth.jWeek(),
          dates: []
        });
      }
      startOfMonth.add(1, 'days');
    }
    return weeks;
  };
  days = date => {
    const {
      events
    } = this.props;
    let weeks = this.weeks(date);
    let startOfMonth = moment(date).startOf('jMonth');
    let endOfMonth = moment(date).endOf('jMonth');
    for (let day = startOfMonth.jDate(); day <= endOfMonth.jDate(); day++) {
      const findWeekByNumber = weeks.find(x => x.number === startOfMonth.jWeek());
      if (findWeekByNumber) {
        let dayName, event;
        switch (startOfMonth.format('dd')) {
          case 'ش':
            dayName = 'Sat';
            break;
          case 'ی':
            dayName = 'Sun';
            break;
          case 'د':
            dayName = 'Mon';
            break;
          case 'س':
            dayName = 'Tue';
            break;
          case 'چ':
            dayName = 'Wed';
            break;
          case 'پ':
            dayName = 'Thu';
            break;
          case 'آ':
            dayName = 'Fri';
            break;
          default:
            break;
        }
        if (events && events.length > 0) {
          const findYearEvent = events.find(x => x.year === parseInt(startOfMonth.format('jYYYY')));
          if (findYearEvent) {
            const findMonthEvent = findYearEvent.data.find(x => x.month === parseInt(startOfMonth.format('jM')));
            if (findMonthEvent) {
              const findDayEvent = findMonthEvent.data.find(x => x.day === day);
              if (findDayEvent) {
                event = findDayEvent;
              }
            }
          }
        }
        findWeekByNumber.dates.push({
          day: day,
          name: dayName,
          date: startOfMonth.format('jYYYY/jM/jD'),
          year: parseInt(startOfMonth.format('jYYYY')),
          month: parseInt(startOfMonth.format('jM')),
          event: event
        });
      }
      startOfMonth.add(1, 'days');
    }
    return weeks;
  };
  mixer = () => {
    const {
      month,
      prevMonth,
      nextMonth
    } = this.state;
    const cloneMonth = [...month];
    const clonePrevMonth = [...prevMonth];
    const cloneNextMonth = [...nextMonth];
    cloneMonth.forEach(week => {
      const findWeekInPrevMonth = clonePrevMonth.find(x => x.number === week.number);
      if (findWeekInPrevMonth) {
        findWeekInPrevMonth.dates.sort(function (a, b) {
          return parseFloat(b.day) - parseFloat(a.day);
        });
        findWeekInPrevMonth.dates.forEach(date => {
          week.dates.unshift(date);
        });
      }
      const findWeekInNextMonth = cloneNextMonth.find(x => x.number === week.number);
      if (findWeekInNextMonth) {
        findWeekInNextMonth.dates.forEach(date => {
          week.dates.push(date);
        });
      }
    });
    this.setState({
      month: cloneMonth
    });
  };
  nextMonth = () => {
    this.setState({
      animation: 'animate__fadeInLeft'
    }, () => {
      const {
        options
      } = this.props;
      const {
        momentInfo,
        monthInfo
      } = this.state;
      const m = moment(momentInfo);
      const month = m.clone().add(1, 'jMonth');
      if (options && options.stopChangingYears) {
        if (parseInt(month.format('jYYYY')) !== monthInfo.year) {
          this.setState({
            disableNextBtn: true,
            disablePrevBtn: false
          });
        } else {
          this.setState({
            disableNextBtn: false,
            disablePrevBtn: false
          }, () => {
            this.bind(month);
          });
        }
      } else {
        this.bind(month);
      }
    });
  };
  prevMonth = () => {
    this.setState({
      animation: 'animate__fadeInRight'
    }, () => {
      const {
        options
      } = this.props;
      const {
        momentInfo,
        monthInfo
      } = this.state;
      const m = moment(momentInfo);
      const month = m.clone().subtract(1, 'jMonth');
      if (options && options.stopChangingYears) {
        if (parseInt(month.format('jYYYY')) !== monthInfo.year) {
          this.setState({
            disablePrevBtn: true,
            disableNextBtn: false
          });
        } else {
          this.setState({
            disableNextBtn: false,
            disablePrevBtn: false
          }, () => {
            this.bind(month);
          });
        }
      } else {
        this.bind(month);
      }
    });
  };
  scrollToTargetAdjusted(id) {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
  goToToday = () => {
    this.setState({
      animation: 'animate__fadeIn'
    }, () => {
      const m = moment();
      this.bind(m);
    });
  };
  changeView = view => {
    this.setState({
      view: view
    }, () => {
      const {
        view,
        uniqueId,
        monthInfo
      } = this.state;
      if (view === 'year') {
        this.scrollToTargetAdjusted(`calendar-${uniqueId}-year-${monthInfo.year}`);
      }
    });
  };
  selectYear = year => {
    this.setState(prevState => ({
      monthInfo: {
        ...prevState.monthInfo,
        year: year
      }
    }), () => {
      const {
        uniqueId,
        monthInfo
      } = this.state;
      this.scrollToTargetAdjusted(`calendar-${uniqueId}-year-${monthInfo.year}`);
      this.changeView('month');
    });
  };
  selectMonth = month => {
    const {
      monthInfo
    } = this.state;
    const m = moment(`${monthInfo.year}/${month}/1`, 'jYYYY/jM/jD');
    this.setState(prevState => ({
      monthInfo: {
        ...prevState.monthInfo,
        number: parseInt(m.format('jM')),
        name: m.format('jMMMM')
      },
      momentInfo: m
    }), () => {
      const {
        momentInfo
      } = this.state;
      this.bind(momentInfo);
      this.changeView('day');
    });
  };
  selectDay = item => {
    const m = moment(item.date, 'jYYYY/jM/jD');
    this.setState({
      monthInfo: {
        number: parseInt(m.format('jM')),
        name: m.format('jMMMM'),
        day: parseInt(m.format('jD')),
        year: parseInt(m.format('jYYYY'))
      }
    }, () => {
      const {
        callback
      } = this.props;
      this.bind(m, true);
      item.gregorian = moment(item.date, 'jYYYY/jM/jD').format('YYYY-M-D');
      if (callback) callback(item);
    });
  };
  render() {
    const {
      month,
      months,
      monthInfo,
      years,
      today,
      animation,
      view,
      uniqueId,
      disableNextBtn,
      disablePrevBtn
    } = this.state;
    const {
      options
    } = this.props;
    let toolsMainBtnColor = 'secondary';
    let toolsSubBtnColor = 'outline-dark';
    if (options) {
      switch (options.calendarToolsColor) {
        case 'primary':
          toolsMainBtnColor = 'warning';
          toolsSubBtnColor = 'light';
          break;
        case 'success':
        case 'danger':
          toolsMainBtnColor = 'dark';
          toolsSubBtnColor = 'light';
          break;
        case 'dark':
          toolsMainBtnColor = 'light';
          toolsSubBtnColor = 'light';
          break;
      }
    }
    return /*#__PURE__*/React.createElement("div", {
      className: 'react-bootstrap-jalali-calendar'
    }, view === 'day' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "fw-bold h-100"
    }, options && options.hideToolsBar ? null : /*#__PURE__*/React.createElement("div", {
      className: `row g-0 align-items-center p-3 tools ${options && options.calendarToolsColor ? `bg-${options.calendarToolsColor}` : 'bg-light'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: 'col-2 text-start'
    }, /*#__PURE__*/React.createElement(Button, {
      variant: toolsSubBtnColor,
      disabled: options && options.stopChangingMonths || disablePrevBtn,
      onClick: this.prevMonth
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
    })))), /*#__PURE__*/React.createElement("div", {
      className: 'col text-center'
    }, /*#__PURE__*/React.createElement(ButtonGroup, {
      "aria-label": "control Keys"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: toolsMainBtnColor,
      disabled: options && options.stopChangingMonths,
      className: "text-decoration-none px-5",
      onClick: () => this.changeView('month')
    }, monthInfo?.name), /*#__PURE__*/React.createElement(Button, {
      variant: toolsSubBtnColor,
      disabled: options && (options.stopChangingYears || options.stopChangingMonths),
      className: "text-decoration-none px-3",
      onClick: () => this.changeView('year')
    }, monthInfo?.year))), /*#__PURE__*/React.createElement("div", {
      className: 'col-2 text-end'
    }, /*#__PURE__*/React.createElement(Button, {
      variant: toolsSubBtnColor,
      disabled: options && options.stopChangingMonths || disableNextBtn,
      onClick: this.nextMonth
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16"
    }, /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      d: "M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
    }))))), /*#__PURE__*/React.createElement(Table, {
      striped: "columns",
      className: "m-0 overflow-hidden"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      className: `text-center border-0 ${options && options.calendarHeaderColor ? `table-${options.calendarHeaderColor}` : 'table-primary'}`
    }, /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u0634"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u06CC"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u062F"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u0633"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u0686"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u067E"), /*#__PURE__*/React.createElement("th", {
      className: "border-0"
    }, "\u062C"))), /*#__PURE__*/React.createElement("tbody", {
      className: "overflow-hidden"
    }, month ? /*#__PURE__*/React.createElement(React.Fragment, null, month.map((week, index) => {
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement("tr", {
        className: `text-center border-0 ${animation}`
      }, week.dates.map((date, index) => {
        const fri = date.name === 'Fri' ? ' text-danger' : '';
        const event = date.event?.isHoliday ? ' border-bottom border-danger border-top text-danger bg-danger-subtle' : '';
        const notInMonthAndNotFri = date.month !== monthInfo.number && date.name !== 'Fri' ? ' text-black opacity-25' : '';
        const notInMonthAndFri = date.month !== monthInfo.number && date.name === 'Fri' ? ' text-danger opacity-50' : '';
        const currentDay = date.month === monthInfo.number && date.date === today ? ' text-primary bg-primary-subtle' : '';
        const selectedDay = date.month === monthInfo.number && date.day === monthInfo.day ? '  text-success bg-success-subtle' : '';
        return /*#__PURE__*/React.createElement("td", {
          key: index,
          title: date.event?.description,
          className: `p-0 align-middle border-0`
        }, /*#__PURE__*/React.createElement("div", {
          className: `p-3 pointer${currentDay}${selectedDay}${fri}${event}${notInMonthAndNotFri}${notInMonthAndFri}`,
          onClick: () => this.selectDay(date)
        }, date.day));
      })));
    })) : null), options && options.hideTodayButton ? null : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("tfoot", {
      className: 'bg-transparent'
    }, /*#__PURE__*/React.createElement("tr", {
      className: "text-center border-0"
    }, /*#__PURE__*/React.createElement("td", {
      colSpan: 7,
      className: "border-0 p-0"
    }, /*#__PURE__*/React.createElement(Button, {
      className: "w-100 rounded-0",
      size: "lg",
      variant: 'primary',
      onClick: this.goToToday
    }, "\u0628\u0631\u0648 \u0628\u0647 \u0627\u0645\u0631\u0648\u0632")))))))) : null, view === 'month' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "h-100 months"
    }, /*#__PURE__*/React.createElement("div", {
      className: `p-3 text-center ${options && options.calendarToolsColor ? `bg-${options.calendarToolsColor}` : 'bg-light'}`
    }, /*#__PURE__*/React.createElement(Button, {
      variant: 'outline-secondary',
      disabled: options && (options.stopChangingYears || options.stopChangingMonths),
      className: "text-decoration-none px-5",
      onClick: () => this.changeView('year')
    }, monthInfo?.year)), /*#__PURE__*/React.createElement(Table, {
      striped: true,
      bordered: true,
      className: "overflow-hidden m-0"
    }, /*#__PURE__*/React.createElement("tbody", null, months.map((month, index) => {
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement("tr", {
        className: 'text-center pointer'
      }, month.map((item, index) => {
        const currentMonth = monthInfo.number === item.id ? 'table-primary' : '';
        return /*#__PURE__*/React.createElement(React.Fragment, {
          key: index
        }, /*#__PURE__*/React.createElement("td", {
          className: `py-3 ${currentMonth}`,
          onClick: () => this.selectMonth(item.id)
        }, item.name));
      })));
    }))))) : null, view === 'year' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: 'years overflow-auto'
    }, /*#__PURE__*/React.createElement(Table, {
      borderless: true,
      className: "overflow-hidden m-0"
    }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      className: "p-0"
    }, /*#__PURE__*/React.createElement(Row, null, years.map((year, index) => {
      const currentYear = year === monthInfo.year ? 'bg-success-subtle rounded' : '';
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement(Col, {
        sm: "12",
        xl: "4",
        id: `calendar-${uniqueId}-year-${year}`
      }, /*#__PURE__*/React.createElement("div", {
        className: `pointer text-center py-3 ${currentYear}`,
        onClick: () => this.selectYear(year)
      }, year)));
    })))))))) : null);
  }
}
export default CalendarApp;