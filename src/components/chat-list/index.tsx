import React, { useEffect, useRef, useState } from "react";
import { ChatAppContext } from "Context";
import { useContext } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import Skeleton from "react-loading-skeleton";
import { GET_CHATS, GET_MORE_MESSAGES, POST_MESSAGE } from "Queries";
import { USERS } from "Components/user-selection";
import { dateTimeSortFunc, isToday, mergeArraysByKey } from "Utils";

import styles from "./index.module.css";

type ChatMessage = {
  messageId?: string;
  text: string;
  datetime?: string;
  userId: string;
  status?: string;
};

type MessagesProps = {
  messagesloading: boolean;
  currentChatList: Array<ChatMessage>;
  onLoadOlderClick: () => void;
  onLoadMoreClick: () => void;
  scrollToTop: boolean;
};

type MessageStatusProps = {
  chat: ChatMessage;
};

const Messages = ({
  messagesloading,
  currentChatList,
  onLoadOlderClick,
  onLoadMoreClick,
  scrollToTop,
}: MessagesProps) => {
  const chatAppContext = useContext(ChatAppContext);
  const messagesStartRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentChatList) {
      if (scrollToTop) {
        messagesStartRef.current?.scrollIntoView({ behavior: "auto" });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }
    }
  }, [currentChatList, messagesEndRef, messagesStartRef, scrollToTop]);

  // if (messagesloading) return <Skeleton count={18} />;
  return (
    <React.Fragment>
      <li className={styles["load-old"]}>
        <Button
          variant="info"
          onClick={onLoadOlderClick}
          ref={messagesStartRef}
        >
          Read More <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </li>
      {currentChatList.length > 0
        ? currentChatList?.map((chat, index) => {
            const isCurrentUser =
              chatAppContext.chatInfo.currentUser?.value === chat.userId;
            const user = USERS.find((u) => u.value === chat.userId);
            const dateTime = new Date(chat.datetime!);

            return (
              <li
                key={index}
                className={
                  isCurrentUser ? styles["chat-right"] : styles["chat-left"]
                }
              >
                <div className={styles["chat-avatar"]}>
                  <img src={user?.avatar} alt="User" />
                  <div className={styles["chat-name"]}>{user?.name}</div>
                </div>
                <div className={styles["chat-text"]}>
                  <pre>{chat.text}</pre>
                </div>
                <div className={styles["chat-hour"]}>
                  {isToday(dateTime)
                    ? dateTime.toLocaleTimeString()
                    : dateTime.toLocaleString()}
                  <MessageStatus chat={chat} />
                </div>
              </li>
            );
          })
        : null}
      <li className={styles["load-more"]}>
        <Button variant="info" onClick={onLoadMoreClick} ref={messagesEndRef}>
          Read More <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      </li>
    </React.Fragment>
  );
};

const MessageStatus = ({ chat }: MessageStatusProps) => {
  const chatAppContext = useContext(ChatAppContext);

  if (chatAppContext.chatInfo.currentUser?.value !== chat.userId) {
    return null;
  }

  if (chat.status === "success") {
    return (
      <React.Fragment>
        <FontAwesomeIcon icon={faCheckCircle} color={"green"} />
        Sent
      </React.Fragment>
    );
  }

  if (chat.status === "error") {
    return (
      <React.Fragment>
        <FontAwesomeIcon icon={faExclamationCircle} color={"red"} />
        Error
      </React.Fragment>
    );
  }

  return null;
};

const ChatList = () => {
  const chatAppContext = useContext(ChatAppContext);
  const [chatAppInfo, setChatAppInfo] = useState(chatAppContext.chatInfo);
  const [loadOlderMessages, setLoadOlderMessages] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentChatList, setCurrentChatList] = useState<Array<ChatMessage>>(
    []
  );
  const [currentTextMessage, setCurrentTextMessage] = useState("");
  const onError = (error: ApolloError) => {
    setErrorMessage(error.message);
    setShowError(true);
  };

  const [getChats, { loading, error }] = useLazyQuery(GET_CHATS, {
    onCompleted: (data) => {
      const latestMessages = data.fetchLatestMessages
        .slice()
        .reverse() as Array<ChatMessage>;
      setCurrentChatList(latestMessages);
      setScrollToTop(false);
    },
    onError,
  });
  const [getMoreMessages, { loading: moreMessagesloading }] = useLazyQuery(
    GET_MORE_MESSAGES,
    {
      onCompleted: (data) => {
        if (currentChatList) {
          const moreMessages = data.fetchMoreMessages.slice();
          let newChatList = currentChatList?.slice();
          if (loadOlderMessages) {
            newChatList.unshift(...moreMessages);
          } else {
            newChatList = mergeArraysByKey(
              newChatList,
              moreMessages,
              "messageId"
            );
          }
          const orderedList = newChatList.sort(dateTimeSortFunc);

          console.log(newChatList);
          console.log(orderedList);
          setCurrentChatList(orderedList);
          setScrollToTop(loadOlderMessages);
        }
      },
      onError,
    }
  );

  const [postMessage] = useMutation(POST_MESSAGE, {
    onCompleted: (data) => {
      const { postMessage: message } = data;
      delete message.__typename;
      message.status = "success";
      const orderedList = currentChatList
        ?.concat(message)
        .sort(dateTimeSortFunc);
      setCurrentChatList(orderedList);
      setCurrentTextMessage("");
    },
    onError: () => {
      const message = {
        datetime: new Date().toISOString(),
        messageId: "-1",
        text: currentTextMessage,
        userId: chatAppContext.chatInfo.currentUser?.value!,
        status: "error",
      };
      const orderedList = currentChatList
        ?.concat(message)
        .sort(dateTimeSortFunc);
      setCurrentChatList(orderedList);
      setCurrentTextMessage("");
    },
  });

  useEffect(() => {
    if (
      JSON.stringify(chatAppContext.chatInfo) !== JSON.stringify(chatAppInfo)
    ) {
      setChatAppInfo(chatAppContext.chatInfo);
    }
  }, [chatAppContext.chatInfo, chatAppInfo]);

  useEffect(() => {
    if (
      chatAppInfo.currentUser?.value &&
      chatAppInfo.currentChatChannel?.value
    ) {
      getChats({
        variables: { channelId: chatAppInfo.currentChatChannel.value },
      });
    }
  }, [chatAppInfo.currentChatChannel, chatAppInfo.currentUser, getChats]);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>{error.message}</p>;
  if (!chatAppInfo.currentUser?.value || !chatAppInfo.currentChatChannel?.value)
    return null;

  return (
    <React.Fragment>
      <div className={styles["channel-name"]}>
        <span>{chatAppContext.chatInfo.currentChatChannel?.name}</span>
      </div>
      {
        <div className={styles["chat-container"]}>
          {showError && (
            <Alert
              variant="danger"
              onClose={() => setShowError(false)}
              dismissible
            >
              <Alert.Heading>Something went wrong!</Alert.Heading>
              <p>{errorMessage}</p>
            </Alert>
          )}
          <ul className={styles["chat-box"]}>
            {currentChatList!.length > 0 && (
              <Messages
                messagesloading={moreMessagesloading}
                currentChatList={currentChatList!}
                scrollToTop={scrollToTop}
                onLoadOlderClick={() => {
                  setLoadOlderMessages(true);
                  getMoreMessages({
                    variables: {
                      channelId: chatAppInfo.currentChatChannel?.value,
                      old: true,
                      messageId: currentChatList![0].messageId,
                    },
                  });
                }}
                onLoadMoreClick={() => {
                  const latestMessage = currentChatList
                    ?.slice()
                    .reverse()
                    .find((message) => {
                      return message.status !== "error";
                    });
                  if (latestMessage) {
                    setLoadOlderMessages(false);
                    getMoreMessages({
                      variables: {
                        channelId: chatAppInfo.currentChatChannel?.value,
                        old: false,
                        messageId: latestMessage.messageId,
                      },
                    });
                  }
                }}
              />
            )}
          </ul>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type your message here..."
              value={currentTextMessage}
              onChange={(e) => {
                if (e.currentTarget) {
                  setCurrentTextMessage(e.currentTarget.value);
                }
              }}
            />
            <Button
              variant="info"
              onClick={() => {
                setLoadOlderMessages(false);
                postMessage({
                  variables: {
                    channelId: chatAppInfo.currentChatChannel?.value,
                    userId: chatAppInfo.currentUser?.value,
                    text: currentTextMessage,
                  },
                });
                const latestMessage = currentChatList
                  ?.slice()
                  .reverse()
                  .find((message) => {
                    return message.status !== "error";
                  });
                if (latestMessage) {
                  setLoadOlderMessages(false);
                  getMoreMessages({
                    variables: {
                      channelId: chatAppInfo.currentChatChannel?.value,
                      old: false,
                      messageId: latestMessage.messageId,
                    },
                  });
                }
              }}
            >
              Send Message <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </Form.Group>
        </div>
      }
    </React.Fragment>
  );
};

export default ChatList;
