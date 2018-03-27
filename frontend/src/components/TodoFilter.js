import React from "react";
import { FILTER_ALL, FILTER_COMPLETED, FILTER_UNCOMPLETED } from "../App";

export default ({ filter, onChange }) => (
  <div id="TodoFilter">
    <span id="filter-all" className={filter === FILTER_ALL ? "active" : ""} onClick={() => onChange(FILTER_ALL)}>
      ALL
    </span>
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
  </div>
);
