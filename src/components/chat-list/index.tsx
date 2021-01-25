import React, { useEffect, useRef, useState } from "react";
import { ChatAppContext } from "Context";
import { useContext } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useLazyQuery } from "@apollo/client";
import Skeleton from "react-loading-skeleton";
import { GET_CHATS, GET_MORE_MESSAGES } from "Queries";
import { USERS } from "Components/user-selection";
import { isToday } from "Utils";

import styles from "./index.module.css";

type ChatMessage = {
  messageId?: string;
  text: string;
  datetime?: string;
  userId: string;
};

type MessagesProps = {
  messagesloading: boolean;
  currentChatList: Array<ChatMessage>;
  onLoadOlderClick: () => void;
  onLoadMoreClick: () => void;
  scrollToTop: boolean;
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

  if (messagesloading) return <Skeleton count={18} />;
  return (
    <React.Fragment>
      <li className={styles["chat-left"]}>
        <Button
          variant="info"
          onClick={onLoadOlderClick}
          ref={messagesStartRef}
        >
          Read More <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </li>
      {currentChatList?.map((chat, index) => {
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
            <div className={styles["chat-text"]}>{chat.text}</div>
            <div className={styles["chat-hour"]}>
              {isToday(dateTime)
                ? dateTime.toLocaleTimeString()
                : dateTime.toLocaleString()}
              {/* TO-DO show status of sending message */}
            </div>
          </li>
        );
      })}
      <li className="left">
        <Button variant="info" onClick={onLoadMoreClick} ref={messagesEndRef}>
          Read More <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      </li>
    </React.Fragment>
  );
};

const ChatList = () => {
  const chatAppContext = useContext(ChatAppContext);
  const [chatAppInfo, setChatAppInfo] = useState(chatAppContext.chatInfo);
  const [loadOlderMessages, setLoadOlderMessages] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentChatList, setCurrentChatList] = useState<
    Array<ChatMessage> | undefined
  >();

  const [getChats, { loading, error }] = useLazyQuery(GET_CHATS, {
    onCompleted: (data) => {
      const newChatList = data.fetchLatestMessages.slice().reverse();
      setCurrentChatList(newChatList);
      setScrollToTop(false);
    },
  });
  const [
    getMoreMessages,
    { loading: moreMessagesloading, error: moreMessagesError },
  ] = useLazyQuery(GET_MORE_MESSAGES, {
    onCompleted: (data) => {
      if (currentChatList) {
        const newChatList = currentChatList?.slice();
        const moreMessages = data.fetchMoreMessages.slice().reverse();
        if (loadOlderMessages) {
          newChatList.unshift(...moreMessages);
        } else {
          newChatList.push(...moreMessages);
        }
        setCurrentChatList(newChatList);
        setScrollToTop(loadOlderMessages);
      }
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

  useEffect(() => {
    if (moreMessagesError) {
      setShowError(true);
    }
  }, [moreMessagesError]);

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <React.Fragment>
      <div className={styles["channel-name"]}>
        <span>{chatAppContext.chatInfo.currentChatChannel?.name}</span>
      </div>
      {currentChatList && (
        <div className={styles["chat-container"]}>
          {showError && (
            <Alert
              variant="danger"
              onClose={() => setShowError(false)}
              dismissible
            >
              <Alert.Heading>Could not load messages!</Alert.Heading>
              <p>{moreMessagesError?.message}</p>
            </Alert>
          )}
          <ul className={styles["chat-box"]}>
            <Messages
              messagesloading={moreMessagesloading}
              currentChatList={currentChatList}
              scrollToTop={scrollToTop}
              onLoadOlderClick={() => {
                setLoadOlderMessages(true);
                getMoreMessages({
                  variables: {
                    channelId: chatAppInfo.currentChatChannel?.value,
                    old: true,
                    messageId: currentChatList[0].messageId,
                  },
                });
              }}
              onLoadMoreClick={() => {
                setLoadOlderMessages(false);
                getMoreMessages({
                  variables: {
                    channelId: chatAppInfo.currentChatChannel?.value,
                    old: false,
                    messageId:
                      currentChatList[currentChatList.length - 1].messageId,
                  },
                });
              }}
            />
          </ul>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type your message here..."
            />
            <Button variant="info">
              Send Message <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </Form.Group>
        </div>
      )}
    </React.Fragment>
  );
};

export default ChatList;
