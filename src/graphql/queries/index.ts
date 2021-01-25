import { gql } from "@apollo/client";

const GET_CHATS = gql`
  query Messages($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

const GET_MORE_MESSAGES = gql`
  query MoreMessages($channelId: String!, $old: Boolean!, $messageId: String!) {
    fetchMoreMessages(channelId: $channelId, old: $old, messageId: $messageId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

const POST_MESSAGE = gql`
  mutation PostMessage($channelId: String!, $userId: String!, $text: String!) {
    postMessage(channelId: $channelId, text: $text, userId: $userId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export { GET_CHATS, GET_MORE_MESSAGES, POST_MESSAGE };
