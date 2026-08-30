// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://med-ai-website-pxjy.vercel.app/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("medai_token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("medai_token");
//       localStorage.removeItem("medai_user");

//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://med-ai-website-pxjy.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("medai_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("medai_token");
      localStorage.removeItem("medai_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;