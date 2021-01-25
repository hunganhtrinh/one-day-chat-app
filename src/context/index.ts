import React from "react";

export type ChatAppContextType = {
  chatInfo: {
    currentUser?: string;
    currentChatChannel?: string;
    currentChatChannelId?: string;
  };
  setCurrentUser: (user: string) => void;
  setcurrentChatChannel: (chatGroup: string) => void;
  setcurrentChatChannelId: (chatGroupId: string) => void;
};

const ChatAppContext = React.createContext<ChatAppContextType>({
  chatInfo: {
    currentUser: "",
    currentChatChannel: "",
    currentChatChannelId: "",
  },
  setCurrentUser: () => {},
  setcurrentChatChannel: () => {},
  setcurrentChatChannelId: () => {},
});

export { ChatAppContext };
