export const getInitials = function(input) {
    if (!input) return '';
    return input
      .split(' ')          
      .map(word => word[0]) 
      .join('')             
      .toUpperCase();      
  }
  

export const emailVerification = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

export const API_CALL = function() {
  return "http://localhost:5000";
}