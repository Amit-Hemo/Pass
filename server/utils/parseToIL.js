function parseToIL(utcString){
    const utcTime = new Date(utcString);
    const date = utcTime.toLocaleDateString("he-IL");
    const time = utcTime.toLocaleTimeString("he-IL");
    return {date,time}
}
module.exports =parseToIL;
