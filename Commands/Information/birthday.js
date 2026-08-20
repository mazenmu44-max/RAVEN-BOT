const moment = require('moment')
module.exports = {
    name : 'birthday',
    run : async (client, message, args) => {
        function getNumberOfDays(date1, end) {
            const date2 = new Date(end);
        
            // One day in milliseconds
            const oneDay = 1000 * 60 * 60 * 24;
        
            // Calculating the time difference between two dates
            const diffInTime = date2.getTime() - date1.getTime();
        
            // Calculating the no. of days between two dates
            const diffInDays = Math.round(diffInTime / oneDay);
        
            return diffInDays;
        }
        var st = args.join(' ')
        var dt = new Date();
        console.log(dt_st)
        console.log(getNumberOfDays(new Date(), ));
    }
}