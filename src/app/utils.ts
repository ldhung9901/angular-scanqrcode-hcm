function shift(char, x) {
  let result;

  const code = char.charCodeAt(0);
  if (code >= 65 && code < 91) {
    result = String.fromCharCode(((code + x - 65) % 26) + 65);
  } else if (code >= 48 && code <= 57) {
    result = String.fromCharCode(((code + x - 48) % 10) + 48);
  } else {
    result = String.fromCharCode(((code + x - 97) % 26) + 97);
  }

  return result;
}

export const hashPassword = (password, x) => {
  let result = "";
  for (let i = 0; i < password.length; i++) {
    const char = shift(password[i], x);
    result += char;
  }
  return result;
};
export const zeroPad = (num, places) => String(num).padStart(places, "0");
