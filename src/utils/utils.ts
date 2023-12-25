export function formatDate(date: Date): string {
    // Get day, month, and year components
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    const dateString = `${day}-${month}-${year}`;

    // Set the value of the text input
    input.value = dateString;
  }
