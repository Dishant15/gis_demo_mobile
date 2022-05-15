export const getIsUserLoggedIn = store => !!store.auth.token;

export const getLoggedUserDetails = store => store.auth.user;
