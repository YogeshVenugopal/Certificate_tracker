const getInitials = function(input) {
    if (!input) return '';
    return input
      .split(' ')          
      .map(word => word[0]) 
      .join('')             
      .toUpperCase();      
  }
  
  export default getInitials;