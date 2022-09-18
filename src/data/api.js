
export const SingleCoin = (id) =>
  `https://d2d2xuybc6.execute-api.ap-south-1.amazonaws.com/prod/coin?coinId=${id}`

export const HistoricalChart = (id, fromDate, currency) =>{

var currentDate = Math.floor(new Date() / 1000).toFixed(0)
var pastDate = new Date().getTime();
 let fromDateUnix;
switch (fromDate) {
  case '15M': 
    fromDateUnix = Math.floor(new Date().getTime() - 15 * 60000)
      .toFixed(0)
    break
  case '1H':
    fromDateUnix = Math.floor(new Date().getTime() - 60 * 60000)
      .toFixed(0)
    break
  case '4H':
    fromDateUnix = Math.floor(new Date().getTime() - 4 * 15 * 60000)
      .toFixed(0)
    break
  case '24H':
    fromDateUnix = Math.floor(new Date().getTime() - 24 * 15 * 60000)
      .toFixed(0)
    break
  case '1W':
    fromDateUnix = Math.floor(new Date().getTime() - 7 * 24 * 15 * 60000).toFixed(0)
      
    break
  default:
   fromDateUnix = Math.floor(
     new Date().getTime() - 7 * 24 * 15 * 60000
   ).toFixed(0)
} 
 return `https://d2d2xuybc6.execute-api.ap-south-1.amazonaws.com/prod/chartdata?fromDate=${fromDateUnix}`}

