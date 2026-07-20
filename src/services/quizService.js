import api from "./api";

import {
  getCurrentUserId,
} from "./courseService";


export const getMyQuizzes =
  async ({
    userId:
      providedUserId,
    courseId,
  } = {}) => {
    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error(
        "Your login session is invalid. Please log in again."
      );
    }

    const params = {
      userId,
    };

    const validCourseId =
      Number(courseId);

    if (
      Number.isInteger(
        validCourseId
      ) &&
      validCourseId > 0
    ) {
      params.courseId =
        validCourseId;
    }

    const response =
      await api.get(
        "/quizzes/my-quizzes",
        {
          params,
        }
      );

    return response.data;
  };


export const getQuizById =
  async ({
    quizId,
    userId:
      providedUserId,
  }) => {
    const validQuizId =
      Number(quizId);

    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(
        validQuizId
      ) ||
      validQuizId <= 0
    ) {
      throw new Error(
        "A valid quiz ID is required."
      );
    }

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      throw new Error(
        "Your login session is invalid. Please log in again."
      );
    }

    const response =
      await api.get(
        `/quizzes/${validQuizId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };