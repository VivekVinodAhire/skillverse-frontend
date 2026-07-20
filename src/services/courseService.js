import api from "./api";

const getStoredUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
        "skillverseUser"
      ) ||
      localStorage.getItem(
        "skillverseUser"
      );

    if (!storedUser) {
      return null;
    }

    return JSON.parse(
      storedUser
    );
  } catch (error) {
    console.error(
      "Failed to read stored user:",
      error
    );

    return null;
  }
};

export const getCurrentUserId =
  () => {
    const storedUser =
      getStoredUser();

    const rawUserId =
      sessionStorage.getItem(
        "userId"
      ) ||
      localStorage.getItem(
        "userId"
      ) ||
      storedUser?.id ||
      storedUser?.userId;

    const userId =
      Number(rawUserId);

    if (
      !Number.isInteger(
        userId
      ) ||
      userId <= 0
    ) {
      return null;
    }

    return userId;
  };

const requireUserId = (
  providedUserId
) => {
  const parsedProvidedUserId =
    Number(
      providedUserId
    );

  const userId =
    Number.isInteger(
      parsedProvidedUserId
    ) &&
    parsedProvidedUserId > 0
      ? parsedProvidedUserId
      : getCurrentUserId();

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

  return userId;
};

const requirePositiveId = (
  value,
  message
) => {
  const id =
    Number(value);

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      message
    );
  }

  return id;
};

/*
  Start background course generation.

  Backend returns:
  {
    jobId,
    status: "queued"
  }
*/

export const generateCourse =
  async (
    courseData
  ) => {
    const userId =
      requireUserId(
        courseData?.userId
      );

    const response =
      await api.post(
        "/courses/generate",
        {
          ...courseData,
          userId,
        },
        {
          timeout:
            30000,
        }
      );

    return response.data;
  };

/*
  Poll live generation status
*/

export const getCourseGenerationStatus =
  async ({
    jobId,
    userId:
      providedUserId,
  }) => {
    const validJobId =
      requirePositiveId(
        jobId,
        "A valid generation job ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.get(
        `/courses/generation/${validJobId}`,
        {
          params: {
            userId,
          },

          timeout:
            30000,
        }
      );

    return response.data;
  };

/*
  Resume failed generation
*/

export const resumeCourseGeneration =
  async ({
    jobId,
    userId:
      providedUserId,
  }) => {
    const validJobId =
      requirePositiveId(
        jobId,
        "A valid generation job ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.post(
        `/courses/generation/${validJobId}/resume`,
        {
          userId,
        },
        {
          timeout:
            30000,
        }
      );

    return response.data;
  };

export const getAllCourses =
  async () => {
    const response =
      await api.get(
        "/courses"
      );

    return response.data;
  };

export const getMyCourses =
  async (
    providedUserId
  ) => {
    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.get(
        "/courses/my-courses",
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

export const getCourseById =
  async (
    courseId
  ) => {
    const validCourseId =
      requirePositiveId(
        courseId,
        "A valid course ID is required."
      );

    const response =
      await api.get(
        `/courses/${validCourseId}`
      );

    return response.data;
  };

export const deleteMyCourse =
  async ({
    courseId,
    userId:
      providedUserId,
  }) => {
    const validCourseId =
      requirePositiveId(
        courseId,
        "A valid course ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.delete(
        `/courses/${validCourseId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

export const getMyLessons =
  async ({
    userId:
      providedUserId,
    courseId,
  } = {}) => {
    const userId =
      requireUserId(
        providedUserId
      );

    const params = {
      userId,
    };

    const parsedCourseId =
      Number(courseId);

    if (
      Number.isInteger(
        parsedCourseId
      ) &&
      parsedCourseId > 0
    ) {
      params.courseId =
        parsedCourseId;
    }

    const response =
      await api.get(
        "/lessons/my-lessons",
        {
          params,
        }
      );

    return response.data;
  };

export const getLessonById =
  async (
    lessonId
  ) => {
    const validLessonId =
      requirePositiveId(
        lessonId,
        "A valid lesson ID is required."
      );

    const userId =
      requireUserId();

    const response =
      await api.get(
        `/lessons/${validLessonId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

export const getLessonProgress =
  async ({
    lessonId,
    userId:
      providedUserId,
  }) => {
    const validLessonId =
      requirePositiveId(
        lessonId,
        "A valid lesson ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.get(
        `/progress/lessons/${validLessonId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

export const updateLessonProgress =
  async ({
    lessonId,
    courseId,
    userId:
      providedUserId,
    isCompleted,
  }) => {
    const validLessonId =
      requirePositiveId(
        lessonId,
        "A valid lesson ID is required."
      );

    const validCourseId =
      requirePositiveId(
        courseId,
        "A valid course ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.post(
        `/progress/lessons/${validLessonId}`,
        {
          userId,
          courseId:
            validCourseId,
          isCompleted:
            Boolean(
              isCompleted
            ),
        }
      );

    return response.data;
  };

export const getCourseProgress =
  async ({
    courseId,
    userId:
      providedUserId,
  }) => {
    const validCourseId =
      requirePositiveId(
        courseId,
        "A valid course ID is required."
      );

    const userId =
      requireUserId(
        providedUserId
      );

    const response =
      await api.get(
        `/progress/courses/${validCourseId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

export const downloadCourseNotesPdf =
  async (
    courseId
  ) => {
    const validCourseId =
      requirePositiveId(
        courseId,
        "A valid course ID is required."
      );

    const userId =
      requireUserId();

    try {
      const response =
        await api.get(
          `/courses/${validCourseId}/download-notes`,
          {
            params: {
              userId,
            },

            responseType:
              "blob",

            timeout:
              360000,
          }
        );

      const contentDisposition =
        response.headers[
          "content-disposition"
        ] || "";

      const encodedNameMatch =
        contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i
        );

      const normalNameMatch =
        contentDisposition.match(
          /filename="?([^";]+)"?/i
        );

      let fileName =
        `skillverse-course-${validCourseId}-notes.pdf`;

      if (
        encodedNameMatch?.[1]
      ) {
        fileName =
          decodeURIComponent(
            encodedNameMatch[1]
          );
      } else if (
        normalNameMatch?.[1]
      ) {
        fileName =
          normalNameMatch[1];
      }

      const blob =
        new Blob(
          [
            response.data,
          ],
          {
            type:
              "application/pdf",
          }
        );

      const url =
        window.URL
          .createObjectURL(
            blob
          );

      const link =
        document.createElement(
          "a"
        );

      link.href =
        url;

      link.download =
        fileName;

      document.body
        .appendChild(
          link
        );

      link.click();

      link.remove();

      window.setTimeout(
        () => {
          window.URL
            .revokeObjectURL(
              url
            );
        },
        1000
      );

      return {
        success: true,
        fileName,
      };
    } catch (error) {
      if (
        error.response
          ?.data instanceof
        Blob
      ) {
        const responseText =
          await error.response
            .data.text();

        try {
          const responseData =
            JSON.parse(
              responseText
            );

          throw new Error(
            responseData.message ||
              "Failed to download course notes."
          );
        } catch (
          parsingError
        ) {
          if (
            parsingError instanceof
            SyntaxError
          ) {
            throw new Error(
              "Failed to download course notes."
            );
          }

          throw parsingError;
        }
      }

      throw error;
    }
  };