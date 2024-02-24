import { FragmentIdMap } from "openbim-components";
import { ErrorModal } from "../classes/ErrorModal";
import seedrandom from 'seedrandom';

export function extractDataFromDocuments(documents) {
  return documents.map(doc => {
      const docData = doc.data();
      const extractedFields = {};

      // Iterate over the keys of the document data
      Object.keys(docData).forEach(key => {
          // Skip internal Firestore properties (e.g., id, metadata)
          if (!key.startsWith('__')) {
              // Dynamically extract the field and its value
              extractedFields[key] = docData[key];
          }
      });

      return extractedFields;
  });
}

export function formatDate(readDate: Date): string {
  // Get day, month, and year components
  //console.log(readDate);
  console.log(readDate)
  const date = new Date(readDate);
  console.log(date);
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1; // Note: Month is zero-based
  const year: number = date.getFullYear();

  // Ensure two-digit format for day and month
  const formattedDay: string = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;

  // Format the date as "dd-mm-yyyy"
  const formattedDate: string = `${formattedDay}-${formattedMonth}-${year}`;

  return formattedDate;
}
export function interpolateColor(value: number, color1: string = "#57ca8d", color2: string = "#ff2452", minValue: number = -200, maxValue: number = 200): string {
  // Convert hex color to RGB
  //console.log(value)
  const hexToRgb = (color: string) => {
      const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);
      const bigint = parseInt(hex.slice(1), 16);
      return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255
      };
  };

  // Convert RGB to hex color
  const componentToHex = (c) => {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
  }
  const rgbToHex = (r, g, b) => {
      return "#" + componentToHex(Math.round(r)) + componentToHex(Math.round(g)) + componentToHex(Math.round(b));
  }


  const color1Rgb = hexToRgb(color1);
  //console.log("Color 1: ", color1Rgb)
  const color2Rgb = hexToRgb(color2);
  //console.log("Color 2: ", color2Rgb)
  // Interpolate RGB values
  const interpolate = (start: number, end: number, ratio: number) => (start + (end - start) * ratio);

  const ratio = (value - minValue) / (maxValue - minValue);


  //console.log("Ratio:", ratio);
  const interpolatedColor = {
      r: interpolate(color1Rgb.r, color2Rgb.r, ratio),
      g: interpolate(color1Rgb.g, color2Rgb.g, ratio),
      b: interpolate(color1Rgb.b, color2Rgb.b, ratio)
  };
  //console.log("Interpolated Color:", interpolatedColor);
  const hexColorFinal = rgbToHex(interpolatedColor.r, interpolatedColor.g, interpolatedColor.b)
  //console.log("Hex Interpolated Color:", hexColorFinal);
  return hexColorFinal;
}


export const colors = ["--accent1", "--accent2", "--accent3", "--accent4"];

export function uppercaseInitials(inputString: string): string {
  // Remove parentheses, curly braces, and square brackets from the input string
  const sanitizedString = inputString.replace(/[(){}\[\]]/g, ' ');

  // Split the sanitized input string into words
  const words = sanitizedString.split(" ");

  // Extract the first letter of each word and convert it to uppercase
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  // Join the first three uppercase initials
  const resultString = initials.slice(0, 3).join("");

  return resultString;
}
export function getHexColor(variableName) {
  // Get the computed style of the root element
  const rootStyles = getComputedStyle(document.documentElement);

  // Get the color value of the specified variable
  const colorValue = rootStyles.getPropertyValue(variableName);
  console.log(colorValue)
  // Convert the color value to hex
  

  return colorValue;
}

export function getRandomColorFromList(initials: string, colors: string[]): string {
  const seed = initials
    .split('')
    .map(char => char.charCodeAt(0))
    .reduce((acc, val) => acc + val, 0);

  const rng = seedrandom(seed.toString());

  function getRandomColor() {
    const randomIndex = Math.floor(rng() * colors.length);
    return colors[randomIndex];
  }

  // Get the randomly selected color variable
  const randomColorVariable = getRandomColor();

  // Convert the color variable to hex
  const hexColor = getHexColor(randomColorVariable);

  return hexColor;
}

export function isFirstCharacterLetterOrNumber(inputString: string): boolean {
  if (inputString.length === 0) {
    return false; // Empty string, not a letter or number
  }

  const firstCharacter = inputString.charAt(0);
  const str = firstCharacter;
  // Check if the first character is a letter or a number

  const code = str.charCodeAt(0);
  console.log(str);
  console.log(code);
  if (
    !(code > 47 && code < 58) && // numeric (0-9)
    !(code > 64 && code < 91) && // upper alpha (A-Z)
    !(code > 96 && code < 123)
  ) {
    // lower alpha (a-z)
    return false;
  }
  return true;
}

export function modifyDateInput(input: HTMLInputElement, date: Date) {
  // Create a new Date object for the desired date

  // Format the date as a string in the dd-mm-yyyy format

  // Set the value of the text input
  input.value = new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}
export function setupModal(title, msg, modalFunction) {
    const deleteModal = document.getElementById("this-modal")
    const titleContainer = document.getElementById("modal-title")
    const msgContainer = document.getElementById("modal-msg")
    if (titleContainer) {
      titleContainer.innerHTML = title
    }
    if (msgContainer) {
      msgContainer.innerHTML = msg
    }
    showModal("this-modal")
    console.log(deleteModal)
    const buttonModal = document.getElementById("modal-button")
    const cancelButtonModal = document.getElementById("cancel-button")
    if(buttonModal) {
        buttonModal.onclick = () => { 
          modalFunction()
          closeModal("this-modal")
        };
    }
    if(cancelButtonModal) {
      cancelButtonModal.onclick = () => { 
        
        closeModal("this-modal")
      };
  }
}

export function showModal(id, errorModal = false, msg = "") {
  const modal = document.getElementById(id);
  console.log(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (errorModal) {
      const errorModal = new ErrorModal(modal, msg, id);
    }
    modal.showModal();
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

export function convertPercentageStringToNumber(value: string): number | null {
  const percentageRegex = /^(\d+(\.\d+)?)%$/;
  console.log(value);
  const match = value.match(percentageRegex);
  console.log(match);
  if (match) {
    const numericValue = parseFloat(match[1]);
    return numericValue / 100; // convert percentage to decimal
  } else {
    throw new Error(
      `A percentage value has to be written as X% or as a fraction value 0.X.`
    );
  }

  // If the input doesn't match the expected format, return null or handle the error as needed
  return null;
}

export function convertCurrencyStringToNumber(value: string): number | null {
  const currencyRegex = /^(\$|\$ )?([0-9,]+(\.\d{1,2})?)$/;

  const match = value.match(currencyRegex);

  if (match) {
    const numericValue = parseFloat(match[2].replace(",", ".")); // remove commas if present
    return numericValue;
  }

  // If the input doesn't match the expected format, return null or handle the error as needed
  return null;
}

export function roundNumber(number): number {
  if (number < 100) {
    return Math.round(number * 100) / 100; 
  } else if (number < 1000) {
    return Math.round(number * 10) / 10; 
  } else {
    return Math.round(number); 
  }
}
export function renderProgress(input: number): string {
    const clampedInput = Math.max(0, Math.min(1, input));

    const rescaledValue = 0.09 + 0.91 * clampedInput;
    const progress = rescaledValue * 100
    const progressText = progress + "%"
    console.log(progressText)
    return progressText

}


export function stringifyFragmentIdMap(fragmentIdMap: FragmentIdMap): string {
  const stringifiableMap: { [fragmentID: string]: string[] } = {};

  for (const key in fragmentIdMap) {
    if (fragmentIdMap.hasOwnProperty(key)) {
      const setValues = Array.from(fragmentIdMap[key]);
      stringifiableMap[key] = setValues;
    }
  }

  return JSON.stringify(stringifiableMap);
}

export function parseFragmentIdMap(jsonString: string): FragmentIdMap {
  const parsedMap: { [fragmentID: string]: string[] } = JSON.parse(jsonString);
  const fragmentIdMap: FragmentIdMap = {};

  for (const key in parsedMap) {
    if (parsedMap.hasOwnProperty(key)) {
      const setValues = new Set(parsedMap[key]);
      fragmentIdMap[key] = setValues;
    }
  }

  return fragmentIdMap;
}


export function addArrayList(arrayList, addArray) {
  for (const arrayID in addArray) {
    arrayList.push(addArray[arrayID])
  }
  return arrayList
}

