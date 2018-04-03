import React from "react";

import "./TodoFilter.css";

export const FILTER_ALL = 0;
export const FILTER_UNCOMPLETED = 1;
export const FILTER_COMPLETED = 2;

export default ({ filter, onChange }) => (
  <div id="TodoFilter">
    <span
      id="filter-uncompleted"
      className={filter === FILTER_UNCOMPLETED ? "active" : ""}
      onClick={() => onChange(FILTER_UNCOMPLETED)}
    >
      NOT COMPLETED
    </span>
    <span
      id="filter-completed"
      className={filter === FILTER_COMPLETED ? "active" : ""}
      onClick={() => onChange(FILTER_COMPLETED)}
    >
      COMPLETED
    </span>
    <span id="filter-all" className={filter === FILTER_ALL ? "active" : ""} onClick={() => onChange(FILTER_ALL)}>
      ALL
    </span>
  </div>
);
