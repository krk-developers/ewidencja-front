const moment = require('moment');


const fixUpEndDate = (endDate) => {
  const daysInMonth = moment(endDate.slice(0, 7), 'YYYY-MM').daysInMonth();
  let endDay = +endDate.slice(8);
  let endMonth = +endDate.slice(5, 7);
  let endYear = +endDate.slice(0, 4);

  if(endDay === daysInMonth){
    if(endMonth === 12){
      endYear++;
      endMonth = 1;
      endDay = 1;
    }
    else{
      endMonth++;
      endDay = 1;
    }
  }
  else{
    endDay++;
  }

  endYear = endYear.toString();
  endMonth = endMonth.toString();
  endDay = endDay.toString();
  if(endMonth.length === 1){
    endMonth = `0${endMonth}`;
  }
  if(endDay.length === 1){
    endDay = `0${endDay}`;
  }

  const fixedEnd = `${endYear}-${endMonth}-${endDay}`;
  return fixedEnd;
}

const fixDownEndDate = (endDate) =>{
  const fixedMonth = fixDownMonth(endDate.slice(0, 7));
  const daysInMonth = moment(fixedMonth, 'YYYY-MM').daysInMonth();
  let endDay = +endDate.slice(8);
  let endMonth = +endDate.slice(5, 7);
  let endYear = +endDate.slice(0, 4);

  if(endDay === 1){
    if(endMonth === 1){
      endYear--;
      endMonth = 12;
      endDay = 31;
    }
    else{
      endMonth--;
      endDay = daysInMonth;
    }
  }
  else{
    endDay--;
  }

  endYear = endYear.toString();
  endMonth = endMonth.toString();
  endDay = endDay.toString();
  if(endMonth.length === 1){
    endMonth = `0${endMonth}`;
  }
  if(endDay.length === 1){
    endDay = `0${endDay}`;
  }
  
  const fixedEnd = `${endDay}-${endMonth}-${endYear}`;
  return fixedEnd;
}

const fixDownMonth = (date) => {
  const year = date.slice(0, 4);
  let month = +date.slice(5);
  if(month > 1){
    month--;
  }
  else{
    month = 12;
  }
  if(month < 10){
    month = `0${month}`
  }

  return `${year}-${month}`;

}
  
export{fixUpEndDate, fixDownEndDate}


