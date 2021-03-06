// @flow

import React from "react";
import { Mutation } from "react-apollo";
import { DELETE_TODO_QUERY } from "../../queries";
import TrashIcon from "../svgs/faTrashAltRegular.svg.js";

import "./ContextMenu.css";

type ContextMenuProps = {
  todoID: number,
  x: number,
  y: number
};

export default ({ todoID, x, y }: ContextMenuProps) => (
  <ul
    id="ContextMenu"
    style={{
      top: y,
      left: x
    }}
  >
    <Mutation mutation={DELETE_TODO_QUERY} variables={{ id: todoID }}>
      {(deleteTodo, { data }) => (
        <li
          className="contextmenu-listitem"
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this to-do?")) {
              deleteTodo();
            }
          }}
        >
          <TrashIcon />
          Delete To-Do
        </li>
      )}
    </Mutation>
  </ul>
);
