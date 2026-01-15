
export const generateOTP = (digits = 4) => {
  const num = Math.pow(10, digits - 1);
  return Math.floor(num + Math.random() * 9 * num);
};