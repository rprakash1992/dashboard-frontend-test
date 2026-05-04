import { getRandomId } from "./getRandomId";

// const alphabets = "abcdefghijklmnopqrstuvwxyz";

export const getRandomImageName = (fileName: string) => {
  // let str = "";
  const fileExtensionIndex = fileName?.lastIndexOf(".");
  const fileExtension = fileName?.slice(fileExtensionIndex);

  // for (let i = 0; i < 15; i++) {
  //   const randomNum = Math.ceil(Math.random() * 10);
  //   const letter = alphabets[randomNum];
  //   str += letter;
  // }

  const randomId = getRandomId();

  return `${randomId}${fileExtension}`;
};
