// export const baseProfileImageUrl =
//   "https://vctenterprisefiles.s3.us-east-1.amazonaws.com/profile-images";
export const baseProfileImageUrl =
  "https://vctenterprisefiles.s3.us-east-1.amazonaws.com";
export const baseItemImageUrl =
  "https://vctenterprisefiles.s3.us-east-1.amazonaws.com/item-images";

// Formatted Date to MM-DD-YYYY
export const formatDateToString = (dateString: string) => {
  const date = new Date(dateString);
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1).toString().padStart(2, "0");
  const day = date?.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const formatAMPM = (dateStr: string) => {
  const date1 = new Date(dateStr);
  let hours = date1.getHours();
  let minutes: number | string = date1.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + String(minutes) : minutes;
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const formattedIndexForTitle = (
  existingTitle: string[],
  selectedItemTitle: string,
) => {
  let updatedTitle;
  if (selectedItemTitle) {
    let index = 1;
    updatedTitle = `${selectedItemTitle} ${index}`;
    while (existingTitle?.includes(updatedTitle)) {
      index++;
      updatedTitle = `${selectedItemTitle} ${index}`;
    }
  }
  return updatedTitle;
};

export function getTimeLapsed(dateString: string) {
  if (!dateString) return "-";

  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((Number(now) - Number(past)) / 1000);

  const intervals = {
    year: 31536000, // 365 * 24 * 60 * 60
    month: 2592000, // 30 * 24 * 60 * 60
    week: 604800, // 7 * 24 * 60 * 60
    day: 86400, // 24 * 60 * 60
    hour: 3600, // 60 * 60
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export const getTimeLapsed2 = (dateString: string) => {
  if (!dateString) return "-";

  const now = new Date().getTime();
  const date = new Date(dateString).getTime() - 19800000;
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30.44); // average days in a month
  const diffInYears = Math.floor(diffInDays / 365.25); // average days in a year
  const diffInDecades = Math.floor(diffInYears / 10);
  const diffInCenturies = Math.floor(diffInYears / 100);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else if (diffInYears < 10) {
    return `${diffInYears} years ago`;
  } else if (diffInDecades < 10) {
    return `${diffInDecades} decades ago`;
  } else if (diffInCenturies < 1) {
    return `${diffInCenturies} centuries ago`;
  } else {
    return "A very long time ago";
  }
};

export const generateUniqueId = (): string => {
  return crypto.randomUUID();
  // return String(
  //   Date.now().toString(32) +
  //     Math.random().toString(32) +
  //     Math.random().toString(32)
  // ).replace(/\./g, "");
};

const stringSplice = (
  str: string,
  index: number,
  count: number,
  add: string,
): string => {
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
};

export const getTitle = (str: string, dataObj: any) => {
  let startIndex = 0;
  let newStr = str.slice(7); // slice is used to remove "folder." from the beginning of the title

  Object?.entries(dataObj)?.forEach(([key, val]: any) => {
    startIndex = newStr?.indexOf(key);
    newStr = stringSplice(newStr, startIndex, key.length, val?.title);
  });

  return newStr;
};

// const encrypt = (text: string, shift: number) => {
//   let result = "";

//   for (let i = 0; i < text.length; i++) {
//     let char = text[i];

//     if (char.match(/[a-z]/i)) {
//       const code = text.charCodeAt(i);

//       if (code >= 65 && code <= 90) {
//         char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
//       } else if (code >= 97 && code <= 122) {
//         char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
//       }
//     }

//     result += char;
//   }

//   return result;
// };

// const decrypt = (text: string, shift: number) => {
//   return encrypt(text, 26 - shift);
// };
