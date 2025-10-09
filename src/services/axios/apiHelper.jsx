import axiosInstance from "./axiosInstance";

export const getData = (end_point, config = {}) => {
  return axiosInstance.get(end_point, config);
};

export const postData = (end_point, data, config = {}) => {
  return axiosInstance.post(end_point, data, config);
};

export const putData = (end_point, data, config = {}) => {
  return axiosInstance.put(end_point, data, config);
};

export const patchData = (end_point, data, config = {}) => {
  return axiosInstance.patch(end_point, data, config);
};

export const deleteData = (end_point, config = {}) => {
  return axiosInstance.delete(end_point, config);
};

export const headData = (end_point, config = {}) => {
  return axiosInstance.head(end_point, config);
};

export const optionsData = (end_point, config = {}) => {
  return axiosInstance.options(end_point, config);
};
