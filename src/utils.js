/** @format */

const domain = "https://app-purchase-platform.uk.r.appspot.com"; // deployed url

const handleResponseStatus = (response, errMsg) => {
  //解构
  const { status, ok } = response;

  if (status === 401) {
    localStorage.removeItem("authToken");
    window.location.reload(); // web refresh -> there are no token -> logout
    return;
  }

  if (!ok) {
    throw Error(errMsg);
  }
};

export const login = (credential) => {
  const url = `${domain}/signin`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  })
    .then((response) => {
      if (!response.ok) {
        throw Error("Fail to log in");
      }
      return response.text();
    })
    .then((token) => {
      localStorage.setItem("authToken", token);
    });
};

export const register = (credential) => {
  const url = `${domain}/signup`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((response) => {
    handleResponseStatus(response, "Fail to register");
  });
};

export const uploadApp = (data, file) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/upload`;

  const { title, description, price } = data;
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("media_file", file);

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  }).then((response) => {
    handleResponseStatus(response, "Fail to upload app");
  });
};

export const searchApps = (query) => {
  const title = query?.title ?? "";
  const description = query?.description ?? "";

  const authToken = localStorage.getItem("authToken");
  const url = new URL(`${domain}/search`);
  url.searchParams.append("title", title);
  url.searchParams.append("description", description);

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    handleResponseStatus(response, "Fail to search apps");

    return response.json();
  });
};

export const checkout = async (appId) => {
  const authToken = localStorage.getItem("authToken");
  const url = `${domain}/checkout?appID=${appId}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });
  handleResponseStatus(response, "Fail to checkout");
  const redirectUrl = await response.text();
  //window.location = redirectUrl;
  window.open(redirectUrl);
};
