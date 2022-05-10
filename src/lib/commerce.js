import Commerce from "@chec/commerce.js";

export const commerce = new Commerce(process.env.REACT_APP_PUBLIC_KEY, true)  // true = yes, create new ecom
// this has all the backend routes