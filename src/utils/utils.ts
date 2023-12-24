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