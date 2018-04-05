import React from "react";

import "./ContextMenu.css";

export default ({ location }) => (
  <div
    id="ContextMenu"
    style={{
      top: location.y,
      left: location.x
    }}
  >
    <h3>Context Menu</h3>
  </div>
);
