import React from "react";

export type ChatAppContextType = {
  chatInfo: {
    currentUser?: { name: string; value: string; avatar: string };
    currentChatChannel?: { name: string; value: string };
  };
  setCurrentUser: (user: {
    name: string;
    value: string;
    avatar: string;
  }) => void;
  setcurrentChatChannel: (chat: { name: string; value: string }) => void;
};

const ChatAppContext = React.createContext<ChatAppContextType>({
  chatInfo: {
    currentUser: {
      name: "",
      value: "",
      avatar: "",
    },
    currentChatChannel: {
      name: "",
      value: "",
    },
  },
  setCurrentUser: () => {},
  setcurrentChatChannel: () => {},
});

export { ChatAppContext };
