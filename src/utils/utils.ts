import { ErrorModal } from "../classes/ErrorModal";
export function formatDate(readDate: Date): string {
    // Get day, month, and year components
    console.log(readDate)
    const date = new Date(readDate)
    console.log(date)
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }
    const day: number = date.getDate()
    const month: number = date.getMonth() + 1; // Note: Month is zero-based
    const year: number = date.getFullYear();
  
    // Ensure two-digit format for day and month
    const formattedDay: string = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
  
    // Format the date as "dd-mm-yyyy"
    const formattedDate: string = `${formattedDay}-${formattedMonth}-${year}`;
  
    return formattedDate;
}

export function uppercaseInitials(inputString: string): string {
    // Split the input string into words
    const words = inputString.split(' ');
  
    // Extract the first letter of each word and convert it to uppercase
    const initials = words.map(word => word.charAt(0).toUpperCase());
  
    // Join the first three uppercase initials
    const resultString = initials.slice(0, 3).join('');
  
    return resultString;
}



export function getRandomColorFromList(): string {
    // Define an array of warning and positive colors
    const colors = [
      '--accent1',
      '--accent2',
      '--accent3',
      '--accent4',
    ];
  
    // Function to randomly select a color from the array
    function getRandomColor() {
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }
  
    // Access the selected color from the :root CSS variables
    const randomColorVariable = getRandomColor();
    const selectedColor = getComputedStyle(document.documentElement).getPropertyValue(randomColorVariable);
  
    return selectedColor.trim();
  }

export function isFirstCharacterLetterOrNumber(inputString: string): boolean {
    if (inputString.length === 0) {
        return false; // Empty string, not a letter or number
    }

    const firstCharacter = inputString.charAt(0)
    const str = firstCharacter
    // Check if the first character is a letter or a number
    
    const code = str.charCodeAt(0);
    console.log(str)
    console.log(code)
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    return true;
}

export function modifyDateInput(input: HTMLInputElement, date: Date) {
    // Create a new Date object for the desired date
    

    // Format the date as a string in the dd-mm-yyyy format
    

    // Set the value of the text input
    input.value = (new Date(date)).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
  }

  export function closeModal(id) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
      modal.close()
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
  }

  export function showModal(id, errorModal = false, msg = '') {
    const modal = document.getElementById(id)
    console.log(id)
    if (modal && modal instanceof HTMLDialogElement) {
      if (errorModal) {
        const errorModal = new ErrorModal(modal, msg, id)
      }
      modal.showModal()
      
    } else {
      console.warn("The provided modal wasn't found. ID: ", id)
    }
  }

  export function convertPercentageStringToNumber(value: string): number | null {
    const percentageRegex = /^(\d+(\.\d+)?)%$/;
    console.log(value)
    const match = value.match(percentageRegex);
    console.log(match)
    if (match) {
      const numericValue = parseFloat(match[1]);
      return numericValue / 100; // convert percentage to decimal
    }
    else {
      throw new Error (`A percentage value has to be written as X% or as a fraction value 0.X.`)
    }
  
    // If the input doesn't match the expected format, return null or handle the error as needed
    return null;
  }

  export function convertCurrencyStringToNumber(value: string): number | null {
    const currencyRegex = /^(\$|\$ )?([0-9,]+(\.\d{1,2})?)$/;
  
    const match = value.match(currencyRegex);
  
    if (match) {
      const numericValue = parseFloat(match[2].replace(',', '.')); // remove commas if present
      return numericValue;
    }
  
    // If the input doesn't match the expected format, return null or handle the error as needed
    return null;
  }