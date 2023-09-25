import { Button, Intent, Popover } from "@blueprintjs/core";
import React from "react";

export default function IndexPage() {
  return (
    <div>
      THIS IS A PAGE
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <Popover
          interactionKind="click"
          // popoverClassName={Classes.POPOVER_CONTENT_SIZING}
          position="bottom"
          content={
            <div>
              <h5>Popover title</h5>
            </div>
          }
        >
          <div>This is a div</div>
        </Popover>
      </div>
    </div>
  );
}