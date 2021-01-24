import React from "react";

export type ChatAppContextType = {
  chatInfo: {
    currentUser?: string;
    currentChatChannel?: string;
  };
  setCurrentUser: (user: string) => void;
  setcurrentChatChannel: (chatGroup: string) => void;
};

const ChatAppContext = React.createContext<ChatAppContextType>({
  chatInfo: {
    currentUser: "",
    currentChatChannel: "",
  },
  setCurrentUser: () => {},
  setcurrentChatChannel: () => {},
});

export { ChatAppContext };
