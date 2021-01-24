import { ChatAppContext } from "Context";
import React, { useContext } from "react";

import styles from "./index.module.css";

const CHANNELS = [
  {
    label: "General Channel",
    value: "General Channel",
  },
  {
    label: "Technology Channel",
    value: "Technology Channel",
  },
  {
    label: "LGTM Channel",
    value: "LGTM Channel",
  },
];

const ChatChannelSelection = () => {
  const chatAppContext = useContext(ChatAppContext);
  return (
    <React.Fragment>
      <p>2. Choose your Channel</p>

      <ul className={styles.channels}>
        {CHANNELS.map(({ label, value }, index) => {
          return (
            <li
              key={index}
              className={`${styles.channel}${
                chatAppContext.chatInfo.currentChatGroup === value
                  ? " " + styles.active
                  : ""
              }`}
              onClick={() => {
                chatAppContext.setCurrentChatGroup(value);
              }}
            >
              <p className={styles.name}>{label}</p>
            </li>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export default ChatChannelSelection;
