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