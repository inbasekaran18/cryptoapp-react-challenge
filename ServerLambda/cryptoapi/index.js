const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-south-1' })
const docClient = new AWS.DynamoDB.DocumentClient()
const chartDataPath = '/chartdata'
const coinPath = '/coin'
const coinTable = 'coin_Details'
const historyTable = 'coin_history'

exports.handler = async (event) => {
  let response
  if (event.context['http-method'] === 'GET') {
    if (event.context['resource-path'] === chartDataPath) {
      response = await getChartData(event)
    } else if (event.context['resource-path'] === coinPath) {
      response = await getCoin(event)
    }
    return response
  }
}
const getChartData = async (event) => {
  let response

  var params = {
    TableName: historyTable,
    FilterExpression: 'unixTimestamp >=:from AND unixTimestamp<=:to',
    ProjectionExpression: 'unixTimestamp, price',
    ExpressionAttributeValues: {
      ':from': parseInt(event.params.querystring.fromDate),
      ':to': parseInt(event.params.querystring.toDate)
    }
  }

  try {
    const data = await docClient.scan(params).promise()
    console.log(data)
    response = {
      statusCode: 200,
      body: data.Items
    }
  } catch (err) {
    response = {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }
  return response
}
const getCoin = async (event) => {
  let response
  const params = {
    TableName: coinTable,
    Key: {
      coinId: event.params.querystring.coinId
    }
  }
  try {
    const data = await docClient.get(params).promise()
    response = {
      statusCode: 200,
      data: data.Item
    }
  } catch (err) {
    response = {
      statusCode: 500,
      data: err
    }
  }
  return response
}

