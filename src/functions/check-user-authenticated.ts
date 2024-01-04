export const checkUserAuthenticated = () => {
  const userToken = localStorage.getItem("token");
  if(userToken) {
    return true
  }
  return false
  ;
};
