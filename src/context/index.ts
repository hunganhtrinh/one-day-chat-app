import React from "react";

export type ChatAppContextType = {
  chatInfo: {
    currentUser?: string;
    currentChatGroup?: string;
  };
  setCurrentUser: (user: string) => void;
  setCurrentChatGroup: (chatGroup: string) => void;
};

const ChatAppContext = React.createContext<ChatAppContextType>({
  chatInfo: {
    currentUser: '',
    currentChatGroup: '',
  },
  setCurrentUser: () => {},
  setCurrentChatGroup: () => {},
});

export { ChatAppContext };
