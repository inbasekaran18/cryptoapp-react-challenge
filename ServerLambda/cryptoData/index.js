const https = require('https')
const AWS = require('aws-sdk')
const axios = require('axios')
AWS.config.update({ region: 'ap-south-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const coinTable = 'coin_Details'
const historyTable = 'coin_history'
const coinID = 'bitcoin'
const currency = 'usd'

exports.handler = async (event) => {
  let response
  try {
    const getCoinInfo = await getApiData(`/api/v3/coins/${coinID}`)
    const coinInfoRes = await postCoin(getCoinInfo)
    // Get coin history
    let fromDate = Math.floor(new Date().getTime() - 10 * 60000)
      .toFixed(0)
      .slice(0, -3)
    let toDate = Math.floor(new Date().getTime() / 1000)
    /*const getLastItem = await getChartDataLast(coinID)
    const lastItem = getLastItem.body
  
  let dataDate;
    const lastItemData = JSON.parse(lastItem).Items
    if (
      lastItemData[0]?.unixTimestamp != undefined &&
      lastItemData[0]?.unixTimestamp != null &&
      lastItemData[0]?.unixTimestamp != ''
    ) {
      if(lastItemData[0].unixTimestamp.length>10){
        let detect=lastItemData[0].unixTimestamp.length-10;
        dataDate = lastItemData[0].unixTimestamp.slice(0, -3)
      }else{
        dataDate = lastItemData[0].unixTimestamp
      }
      
    }
    
    if(fromDate<dataDate){
      fromDate=dataDate;
    }
*/
    console.log(
      `/api/v3/coins/${coinID}/market_chart/range?vs_currency=${currency}&from=${fromDate}&to=${toDate}`
    )

    const getHistory = await getApiData(
      `/api/v3/coins/${coinID}/market_chart/range?vs_currency=${currency}&from=${fromDate}&to=${toDate}`
    )
    console.log(`Total records from  api : ${getHistory.prices.length} `)

    //Post coin history
    const coinHistoryRes = await postChartData(getHistory.prices)
    // Response for coin details and history
    return (response = {
      statusCode: 200,
      type: 'Main Response',
      body: `${JSON.stringify(coinHistoryRes)} `
    })
  } catch (err) {
    return (response = {
      statusCode: 500,
      type: 'Main Response',
      body: JSON.stringify(err)
    })
  }
}

// Method for posting coin details
const postCoin = async (rawData) => {
  let response
  const { id, symbol, name, market_data } = rawData
  const params = {
    TableName: coinTable,
    Key: {
      coinId: id
    },
    ReturnValues: 'ALL_OLD',
    Item: {
      coinId: id,
      symbol,
      name,
      market_cap_rank: market_data.market_cap_rank,
      current_price: market_data.current_price.usd,
      market_cap: market_data.market_cap.usd,
      price_change_percentage_1h_in_currency:
        market_data.price_change_percentage_1h_in_currency.usd,
      price_change_percentage_7d_in_currency:
        market_data.price_change_percentage_7d_in_currency.usd,
      market_cap_change_24h_in_currency:
        market_data.market_cap_change_24h_in_currency.usd,
      market_cap_change_percentage_24h_in_currency:
        market_data.market_cap_change_percentage_24h_in_currency.usd,
      price_change_24h: market_data.price_change_24h.usd,
      price_change_percentage_24h: market_data.price_change_percentage_24h,
      price_change_percentage_7d: market_data.price_change_percentage_7d,
      price_change_percentage_14d: market_data.price_change_percentage_14d,
      price_change_percentage_30d: market_data.price_change_percentage_30d,
      price_change_percentage_200d: market_data.price_change_percentage_200d,
      price_change_percentage_1y: market_data.price_change_percentage_1y,
      market_cap_change_24h: market_data.market_cap_change_24h,
      market_cap_change_percentage_24h:
        market_data.market_cap_change_percentage_24h,
      price_change_24h_in_currency:
        market_data.price_change_24h_in_currency.usd,
      total_volume: market_data.total_volume.usd
    }
  }
  try {
    const data = await docClient.put(params).promise()
    response = {
      statusCode: 200,
      type: 'coin details Ingestion',
      body: JSON.stringify(data)
    }
  } catch (err) {
    response = {
      statusCode: 500,
      type: 'coin details Ingestion',
      body: JSON.stringify(err)
    }
  }
  return response
}

// Method for getting latest coin history
const getChartDataLast = async (id) => {
  let response
  let params = {
    TableName: historyTable,
    ScanIndexForward: true,
    Limit: 1
  }

  try {
    const data = await docClient.scan(params).promise()
    response = {
      statusCode: 200,
      type: 'coin details get',
      body: JSON.stringify(data)
    }
  } catch (err) {
    response = {
      statusCode: 500,
      type: 'coin details get',
      body: JSON.stringify(err)
    }
  }
  return response
}

// Method for posting coin details
const postChartData = async (streamData) => {
  let response = {
    statusCode: 200,
    type: 'coin history Ingestion',
    body: { message: 'response without running DB ' }
  }

  if (streamData.length === 0) {
    response = {
      statusCode: 200,
      type: 'coin history Ingestion',
      body: {
        message: `No records available to insert count : ${streamData.length} `
      }
    }
  }

  await streamData.forEach(async (stream) => {
    const uniqueId = `${AWS.util.uuid.v4()}-${Math.random()}`
    const params = {
      TableName: historyTable,
      Item: {
        coinHistoryId: uniqueId.toString(),
        price: stream[1],
        unixTimestamp: stream[0],
        coin: coinID.toString()
      }
    }

    await docClient.put(params, function async(err, data) {
      if (err) {
        console.error(err)
      } else {
        console.log('data inserted')
      }
    })
  })
  return response
}

const getApiData = async (path) => {
  var defaultOptions = {
    method: 'get',
    url: `https://api.coingecko.com/${path}`,
    headers: {}
  }
  const response = await axios(defaultOptions)
  return response.data
}
