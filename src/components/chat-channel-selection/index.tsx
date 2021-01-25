import { ChatAppContext } from "Context";
import React, { useContext } from "react";

import styles from "./index.module.css";

const CHANNELS = [
  {
    label: "General Channel",
    value: "1",
  },
  {
    label: "Technology Channel",
    value: "2",
  },
  {
    label: "LGTM Channel",
    value: "3",
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
                chatAppContext.chatInfo.currentChatChannel?.value === value
                  ? " " + styles.active
                  : ""
              }`}
              onClick={() => {
                chatAppContext.setcurrentChatChannel({
                  name: label,
                  value,
                });
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
