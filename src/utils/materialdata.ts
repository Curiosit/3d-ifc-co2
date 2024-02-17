export async function downloadData() {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    const apiPath = 'https://cyz7bkwwhl.execute-api.us-west-2.amazonaws.com/dev/getmaterialsapi';
    
    

    try {
        const response = await fetch(apiPath);
        console.log(response)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}