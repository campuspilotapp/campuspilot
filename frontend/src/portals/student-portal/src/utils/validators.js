export const minLength = (v, n) => (v || '').trim().length >= n;
export const isPhone = (v) => /^\+?[\d\s]{10,15}$/.test((v || '').trim());
export const isEmail = (v) => /^\S+@\S+\.\S+$/.test((v || '').trim());
