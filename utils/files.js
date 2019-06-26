export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const getFileName = url => {
  if (!url) {
    return;
  }
  url = url.toString();
  return url
    .split("/")
    .pop()
    .replace(/#(.*?)$/, "")
    .replace(/\?(.*?)$/, "");
};

export const getFileFromUrl = async url => {
  // Taken from: https://stackoverflow.com/questions/44070437/how-to-get-a-file-or-blob-from-an-url-in-javascript
  if (!url) {
    return;
  }
  url = url.toString();
  const filename = getFileName(url);
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, {
    type: blob.type
  });
};

export const fileReader = file => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });
  });
};
