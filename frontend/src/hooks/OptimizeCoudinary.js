export const optimizeCloudinary = (url, width = 400) => {
  if (!url) return url;

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto,w_${width},c_scale/`
  );
};