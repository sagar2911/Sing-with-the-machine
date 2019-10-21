export function loadFile(file) {
  if (!file) {
    return;
  }
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = resolve;
    fileReader.onerror = reject;
    fileReader.readAsText(file);
  }).then((evt) => evt.target.result.replace(/(\r\n|\n|\r)/gm, " "));
}

export function loadMidiFileFromServer(filename) {
  if (!filename) {
    throw new Error('Invalid filename');
  }
  return fetch(filename)
    .then((resp) => resp.arrayBuffer());
}
