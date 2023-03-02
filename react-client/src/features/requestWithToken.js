import axios from "axios";

import { TOKEN } from "./auth/authSlice";

export async function getWithTokenNoCatch(url, emptyReturnValue, params) {
  const token = window.localStorage.getItem(TOKEN);
  if (token) {
    const response = await axios.get(url, {
      headers: {
        authorization: token,
      },
      params,
    });
    return response;
  } else {
    return emptyReturnValue;
  }
}

export async function getNoCatch(url, params) {
  return await axios.get(url, {
    params,
  });
}

export async function get(url, params) {
  try {
    const { data } = await axios.get(url, {
      params,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getWithToken(url, emptyReturnValue, params) {
  const token = window.localStorage.getItem(TOKEN);
  try {
    if (token) {
      const { data } = await axios.get(url, {
        headers: {
          authorization: token,
        },
        params,
      });
      return data;
    } else {
      return emptyReturnValue;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function postWithToken(
  url,
  emptyReturnValue,
  payload,
  params,
  additionalHeaders
) {
  const token = window.localStorage.getItem(TOKEN);

  let headers = {
    authorization: token,
  };
  if (additionalHeaders) {
    headers = { ...headers, ...additionalHeaders };
  }
  try {
    if (token) {
      const { data } = await axios.post(url, payload, {
        headers,
        params,
      });
      return data;
    } else {
      return emptyReturnValue;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function putWithToken(url, emptyReturnValue, payload, params) {
  const token = window.localStorage.getItem(TOKEN);
  try {
    if (token) {
      const { data } = await axios.put(url, payload, {
        headers: {
          authorization: token,
        },
        params,
      });
      return data;
    } else {
      return emptyReturnValue;
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteWithToken(url, emptyReturnValue, params) {
  const token = window.localStorage.getItem(TOKEN);
  try {
    if (token) {
      const { data } = await axios.delete(url, {
        headers: {
          authorization: token,
        },
        params,
      });
      return data;
    } else {
      return emptyReturnValue;
    }
  } catch (error) {
    console.error(error);
  }
}
