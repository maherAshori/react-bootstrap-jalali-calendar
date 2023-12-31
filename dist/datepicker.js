import React, { useEffect, useRef, useState } from "react";
import CalendarApp from "./calendar";
import { Dropdown, Modal } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import './calendar.css';
const DatePicker = ({
  name,
  callback,
  value,
  disabled = false,
  required = false,
  id = null,
  placeholder = null,
  label = null,
  events = [],
  options = {}
}) => {
  if (!name) {
    console.error('Please add { name } property to datepicker <DatePicker name={"input-name"}/>');
  } else if (!callback) {
    console.error('Please add { callback } property to datepicker "<DatePicker callback={setValue}"/> ');
  } else if (value === null || value === undefined) {
    console.error('Please add { value } property to datepicker "<DatePicker value={birthdate}"/> ');
  }
  if (!id) {
    id = name;
  }
  if (!placeholder) {
    placeholder = name;
  }
  if (!label) {
    label = name;
  }
  const [showCalendar, setShowCalendar] = useState(false);
  const datepicker = useRef();
  const handleClickOutside = e => {
    if (!datepicker.current.contains(e.target)) {
      setShowCalendar(false);
    }
  };
  const selectedDate = day => {
    callback(day);
    setShowCalendar(false);
  };
  useEffect(() => {
    let w = window.innerWidth;
    if (w > 768) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  });
  const floating = () => {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FloatingLabel, {
      controlId: id,
      label: label,
      className: "text-end",
      dir: 'ltr'
    }, /*#__PURE__*/React.createElement(Form.Control, {
      type: "text",
      readOnly: true,
      disabled: disabled,
      required: required,
      value: value,
      placeholder: placeholder,
      name: name,
      onClick: () => setShowCalendar(true)
    })));
  };
  const formControl = () => {
    const size = options.formControlSize ? options.formControlSize : "";
    const hideLabel = options.hideFormControlLabel;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Form.Group, {
      controlId: id
    }, hideLabel ? null : /*#__PURE__*/React.createElement(Form.Label, {
      className: "d-block text-start"
    }, label), /*#__PURE__*/React.createElement(Form.Control, {
      type: "text",
      readOnly: true,
      size: size,
      dir: 'ltr',
      className: "text-end",
      disabled: disabled,
      required: required,
      value: value,
      placeholder: placeholder,
      name: name,
      onClick: () => setShowCalendar(true)
    })));
  };
  const template = () => {
    if (options && options.template) {
      switch (options.template) {
        case "formControl":
          return formControl();
        default:
          return floating();
      }
    }
    return floating();
  };
  const tabletMode = () => {
    options.tablet = true;
    return /*#__PURE__*/React.createElement(React.Fragment, null, template(), /*#__PURE__*/React.createElement(Modal, {
      onHide: () => setShowCalendar(false),
      show: showCalendar,
      className: "d-flex align-items-end datepicker"
    }, /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(CalendarApp, {
      events: events,
      callback: selectedDate,
      value: value,
      options: options
    }))));
  };
  const desktopMode = () => {
    options.tablet = false;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      show: showCalendar,
      ref: datepicker
    }, /*#__PURE__*/React.createElement(Dropdown.Toggle, {
      variant: 'link',
      className: 'p-0 border-0 text-decoration-none w-100'
    }, template()), /*#__PURE__*/React.createElement(Dropdown.Menu, {
      className: "border-0 p-0 rounded"
    }, /*#__PURE__*/React.createElement(CalendarApp, {
      events: events,
      callback: selectedDate,
      value: value,
      options: options
    }))));
  };
  const selectMode = () => {
    let w = window.innerWidth;
    if (w <= 768) {
      return tabletMode();
    }
    return desktopMode();
  };
  return selectMode();
};
export default DatePicker;