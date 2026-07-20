import api from "./api";

import {
  getCurrentUserId,
} from "./courseService";

export const sendTutorMessage =
  async ({
    message,
    history = [],
    userId:
      providedUserId,
  }) => {
    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    const normalizedMessage =
      String(
        message || ""
      ).trim();

    if (
      !Number.isInteger(
        userId
      ) ||
      userId <= 0
    ) {
      throw new Error(
        "Your login session is invalid. Please log in again."
      );
    }

    if (
      !normalizedMessage
    ) {
      throw new Error(
        "Please enter a question."
      );
    }

    const response =
      await api.post(
        "/ai-tutor/chat",
        {
          userId,

          message:
            normalizedMessage,

          history:
            Array.isArray(
              history
            )
              ? history
              : [],
        }
      );

    return response.data;
  };