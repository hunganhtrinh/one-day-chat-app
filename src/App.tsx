import { useState } from "react";
import { ChatChannelSelection, ChatList, UserSelection } from "Components";
import { ChatAppContext } from "Context";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import "bootstrap/dist/css/bootstrap.css";
import styles from "./App.module.css";

type ChatAppStateType = {
  currentUser?: { name: string; value: string; avatar: string };
  currentChatChannel?: { name: string; value: string };
};

const client = new ApolloClient({
  uri: "https://angular-test-backend-yc4c5cvnnq-an.a.run.app/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

const App = () => {
  const [chatInfo, setChatInfo] = useState<ChatAppStateType>({
    currentUser: { name: "", value: "", avatar: "" },
    currentChatChannel: {
      name: "",
      value: "",
    },
  });
  const setCurrentUser = (user: {
    name: string;
    value: string;
    avatar: string;
  }) => {
    setChatInfo({
      ...chatInfo,
      currentUser: user,
    });
  };
  const setcurrentChatChannel = (chat: { name: string; value: string }) => {
    setChatInfo({
      ...chatInfo,
      currentChatChannel: { ...chat },
    });
  };

  return (
    <ApolloProvider client={client}>
      <div className="container">
        <div className="page-title">
          <div className="row gutters">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <h5 className="title">1 day chat App</h5>
              <p>All messages will be deleted at every 00:00 UTC</p>
            </div>
          </div>
        </div>
        <ChatAppContext.Provider
          value={{
            chatInfo,
            setCurrentUser,
            setcurrentChatChannel,
          }}
        >
          <div className="content-wrapper">
            <div className="row gutters">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                <div className={`${styles.card} m0`}>
                  <div className="row no-gutters">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                      <div className={styles["selection-container"]}>
                        <UserSelection />
                        <ChatChannelSelection />
                      </div>
                    </div>
                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                      <ChatList />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ChatAppContext.Provider>
      </div>
    </ApolloProvider>
  );
};

export default App;
