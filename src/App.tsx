import { useState } from "react";
import { ChatChannelSelection, UserSelection } from "Components";
import { ChatAppContext } from "Context";

import "bootstrap/dist/css/bootstrap.css";
import styles from "./App.module.css";

type ChatAppStateType = {
  currentUser?: string;
  currentChatGroup?: string;
};

const App = () => {
  const [chatInfo, setChatInfo] = useState<ChatAppStateType>({
    currentUser: "",
    currentChatGroup: "",
  });
  const setCurrentUser = (user: string) => {
    setChatInfo({
      currentUser: user,
    });
  };
  const setCurrentChatGroup = (chatGroup: string) => {
    setChatInfo({
      currentChatGroup: chatGroup,
    });
  };

  return (
    <div className="container">
      <div className="page-title">
        <div className="row gutters">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
            <h5 className="title">1 day chat App</h5>
            <p>All messages will be deleted at every 00:00 UTC</p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className={`${styles.card} m0`}>
              <div className="row no-gutters">
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                  <ChatAppContext.Provider
                    value={{
                      chatInfo,
                      setCurrentUser,
                      setCurrentChatGroup,
                    }}
                  >
                    <div className={styles["selection-container"]}>
                      <UserSelection />
                      <ChatChannelSelection />
                    </div>
                  </ChatAppContext.Provider>
                  {/* <div className="users-container">
                    <div className="form-group">
                      <label htmlFor="exampleFormControlSelect1">
                        1. Choose your user
                      </label>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                      >
                        <option>Joyse</option>
                        <option>Sam</option>
                        <option>Russell</option>
                      </select>
                    </div>
                    <p>2. Choose your Channel</p>
                    <ul className="users">
                      <li className="channel active-user">
                        <p className="name-time">
                          <span className="name">General Channel</span>
                        </p>
                      </li>
                      <li className="channel">
                        <p className="name-time">
                          <span className="name">Technology Channel</span>
                        </p>
                      </li>
                      <li className="channel">
                        <p className="name-time">
                          <span className="name">LGTM Channel</span>
                        </p>
                      </li>
                    </ul>
                  </div> */}
                </div>
                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9">
                  {/* <div className="selected-user">
                    <span>LGTM Channel</span>
                  </div>
                  <div className="chat-container">
                    <ul className="chat-box chatContainerScroll">
                      <li className="chat-left">
                        <button type="button" className="btn btn-info">
                          Read More <i className="fa fa-arrow-up"></i>
                        </button>
                      </li>
                      <li className="chat-left">
                        <div className="chat-avatar">
                          <img src="./Russell.png" alt="User" />
                          <div className="chat-name">Russell</div>
                        </div>
                        <div className="chat-text">
                          Hello, I'm Russell.
                          <br />
                          How can I help you today?
                        </div>
                        <div className="chat-hour">08:55</div>
                      </li>
                      <li className="chat-right">
                        <div className="chat-hour">
                          08:56 <span className="fa fa-check-circle"></span>{" "}
                          <span className="chat-message">Sent</span>
                        </div>
                        <div className="chat-text">
                          Hi, Russell
                          <br /> I need more information about Developer Plan.
                        </div>
                        <div className="chat-avatar">
                          <img src="./Joyse.png" alt="User" />
                          <div className="chat-name">Joyse</div>
                        </div>
                      </li>
                      <li className="chat-left">
                        <div className="chat-avatar">
                          <img src="./Sam.png" alt="User" />
                          <div className="chat-name">Sam</div>
                        </div>
                        <div className="chat-text">
                          Are we meeting today?
                          <br />
                          Project has been already finished and I have results
                          to show you.
                        </div>
                        <div className="chat-hour">08:57</div>
                      </li>
                      <li className="chat-right">
                        <div className="chat-hour">
                          08:59 <span className="fa fa-check-circle"></span>{" "}
                          <span className="chat-message">Sent</span>
                        </div>
                        <div className="chat-text">
                          Well I am not sure.
                          <br />I have results to show you.
                        </div>
                        <div className="chat-avatar">
                          <img src="./Joyse.png" alt="User" />
                          <div className="chat-name">Joyse</div>
                        </div>
                      </li>
                      <li className="chat-right">
                        <div className="chat-hour">
                          09:02{" "}
                          <span className="fa fa-exclamation-circle"></span>{" "}
                          <span className="chat-message">Error</span>
                        </div>
                        <div className="chat-text">
                          Hey, can you receive my chat?
                        </div>
                        <div className="chat-avatar">
                          <img src="./Joyse.png" alt="User" />
                          <div className="chat-name">Joyse</div>
                        </div>
                      </li>
                      <li className="left">
                        <button type="button" className="btn btn-info">
                          Read More <i className="fa fa-arrow-down"></i>
                        </button>
                      </li>
                    </ul>
                    <div className="form-group mt-3 mb-0">
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Type your message here..."
                      ></textarea>
                      <button type="button" className="btn btn-info">
                        Send Message <i className="fa fa-send"></i>
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
