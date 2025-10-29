export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;

};
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}