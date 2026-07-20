import api from "./api";

/*
  Read the currently logged-in user
  from sessionStorage.
*/

const getStoredUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
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

/*
  Get currently logged-in user's ID
*/

export const getCurrentUserId =
  () => {
    const storedUser =
      getStoredUser();

    const rawUserId =
      sessionStorage.getItem(
        "userId"
      ) ||
      storedUser?.id ||
      storedUser?.userId;

    const userId =
      Number(rawUserId);

    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return null;
    }

    return userId;
  };

/*
  Generate complete AI course
*/

export const generateCourse =
  async (
    courseData
  ) => {
    const userId =
      Number(
        courseData?.userId
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

    const response =
      await api.post(
        "/courses/generate",
        {
          ...courseData,
          userId,
        }
      );

    return response.data;
  };

/*
  Get all courses
*/

export const getAllCourses =
  async () => {
    const response =
      await api.get(
        "/courses"
      );

    return response.data;
  };

/*
  Get logged-in user's courses
*/

export const getMyCourses =
  async (
    providedUserId
  ) => {
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

/*
  Get complete course
*/

export const getCourseById =
  async (
    courseId
  ) => {
    const validCourseId =
      Number(courseId);

    if (
      !Number.isInteger(
        validCourseId
      ) ||
      validCourseId <= 0
    ) {
      throw new Error(
        "A valid course ID is required."
      );
    }

    const response =
      await api.get(
        `/courses/${validCourseId}`
      );

    return response.data;
  };

/*
  Delete user's course
*/

export const deleteMyCourse =
  async ({
    courseId,
    userId:
      providedUserId,
  }) => {
    const validCourseId =
      Number(courseId);

    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(
        validCourseId
      ) ||
      validCourseId <= 0
    ) {
      throw new Error(
        "A valid course ID is required."
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

/*
  Get logged-in user's lessons
*/

export const getMyLessons =
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
        "/lessons/my-lessons",
        {
          params,
        }
      );

    return response.data;
  };

/*
  Get lesson by ID
*/

export const getLessonById =
  async (
    lessonId
  ) => {
    const validLessonId =
      Number(lessonId);

    const userId =
      getCurrentUserId();

    if (
      !Number.isInteger(
        validLessonId
      ) ||
      validLessonId <= 0
    ) {
      throw new Error(
        "A valid lesson ID is required."
      );
    }

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

/*
  Get lesson progress
*/

export const getLessonProgress =
  async ({
    lessonId,
    userId:
      providedUserId,
  }) => {
    const validLessonId =
      Number(lessonId);

    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(
        validLessonId
      ) ||
      validLessonId <= 0
    ) {
      throw new Error(
        "A valid lesson ID is required."
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
        `/progress/lessons/${validLessonId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

/*
  Update lesson progress
*/

export const updateLessonProgress =
  async ({
    lessonId,
    courseId,
    userId:
      providedUserId,
    isCompleted,
  }) => {
    const validLessonId =
      Number(lessonId);

    const validCourseId =
      Number(courseId);

    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(
        validLessonId
      ) ||
      validLessonId <= 0
    ) {
      throw new Error(
        "A valid lesson ID is required."
      );
    }

    if (
      !Number.isInteger(
        validCourseId
      ) ||
      validCourseId <= 0
    ) {
      throw new Error(
        "A valid course ID is required."
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

/*
  Get complete course progress
*/

export const getCourseProgress =
  async ({
    courseId,
    userId:
      providedUserId,
  }) => {
    const validCourseId =
      Number(courseId);

    const userId =
      Number(
        providedUserId
      ) ||
      getCurrentUserId();

    if (
      !Number.isInteger(
        validCourseId
      ) ||
      validCourseId <= 0
    ) {
      throw new Error(
        "A valid course ID is required."
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
        `/progress/courses/${validCourseId}`,
        {
          params: {
            userId,
          },
        }
      );

    return response.data;
  };

  /*
  Download logged-in user's complete
  course notes as a PDF.
*/

export const downloadCourseNotesPdf =
  async (
    courseId
  ) => {
    const validCourseId =
      Number(courseId);

    const userId =
      getCurrentUserId();

    if (
      !Number.isInteger(
        validCourseId
      ) ||
      validCourseId <= 0
    ) {
      throw new Error(
        "A valid course ID is required."
      );
    }

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

      const encodedFileNameMatch =
        contentDisposition.match(
          /filename\*=UTF-8''([^;]+)/i
        );

      const standardFileNameMatch =
        contentDisposition.match(
          /filename="?([^"]+)"?/i
        );

      let fileName =
        `skillverse-course-${validCourseId}-notes.pdf`;

      if (
        encodedFileNameMatch?.[1]
      ) {
        fileName =
          decodeURIComponent(
            encodedFileNameMatch[1]
          );
      } else if (
        standardFileNameMatch?.[1]
      ) {
        fileName =
          standardFileNameMatch[1];
      }

      const pdfBlob =
        new Blob(
          [
            response.data,
          ],
          {
            type:
              "application/pdf",
          }
        );

      const downloadUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      const downloadLink =
        document.createElement(
          "a"
        );

      downloadLink.href =
        downloadUrl;

      downloadLink.download =
        fileName;

      document.body.appendChild(
        downloadLink
      );

      downloadLink.click();

      downloadLink.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );

      return {
        success: true,
        fileName,
      };
    } catch (error) {
      if (
        error.response
          ?.data instanceof Blob
      ) {
        try {
          const responseText =
            await error.response.data.text();

          const responseData =
            JSON.parse(
              responseText
            );

          throw new Error(
            responseData.message ||
              "Failed to download course notes."
          );
        } catch (
          blobError
        ) {
          if (
            blobError.message !==
            "Unexpected end of JSON input"
          ) {
            throw blobError;
          }
        }
      }

      throw error;
    }
  };