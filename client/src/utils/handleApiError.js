import { AxiosError } from 'axios';

function handleApiError(error) {
  let errorMessage = 'קרתה שגיאה בלתי צפויה, יש לנסות במועד מאוחר יותר.';

  if (error instanceof AxiosError && error?.response?.data?.client) {
    //Axios Error object
    errorMessage = error.response.data.client;
  }
  return errorMessage
}

export default handleApiError;
