import { ChatAppContext } from "Context";
import { useContext } from "react";
import { Form } from "react-bootstrap";
import JoyceAvatar from "Assets/Joyse.png";
import SamAvatar from "Assets/Sam.png";
import RusselAvatar from "Assets/Russell.png";

export const USERS = [
  {
    name: "Joyse",
    value: "Joyse",
    avatar: JoyceAvatar,
  },
  {
    name: "Sam",
    value: "Sam",
    avatar: SamAvatar,
  },
  {
    name: "Russell",
    value: "Russell",
    avatar: RusselAvatar,
  },
];

const UserSelection = () => {
  const chatAppContext = useContext(ChatAppContext);
  return (
    <Form.Group controlId="form.userSelect">
      <Form.Label>1. Choose your user</Form.Label>
      <Form.Control
        value={chatAppContext.chatInfo.currentUser?.value}
        as="select"
        onChange={(e) => {
          if (e.currentTarget) {
            const user = USERS.find(
              (user) => user.value === e.currentTarget.value
            );
            user && chatAppContext.setCurrentUser(user);
          }
        }}
      >
        <option value={""} disabled>
          Please, select a user.
        </option>
        {USERS.map(({ name, value }, index) => {
          return (
            <option key={index} value={value}>
              {name}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default UserSelection;
