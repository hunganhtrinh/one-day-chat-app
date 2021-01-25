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

export { GET_CHATS, GET_MORE_MESSAGES };
