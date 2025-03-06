export const successResponse = (content: any, message: string = "") => {
  return { content: content, message: message, success: true };
};

export const failureResponse = (message: string = "") => {
  return { message: message, success: false };
};
