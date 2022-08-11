const { DynamoDBClient, PutItemCommand, GetItemCommand } = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
const { v4: uuid } = require('uuid')

const dbClient = new DynamoDBClient({
  region: 'us-east-1',
})

const TableName = 'application-table'
const buildKey = (param) => ({
  S: `${param}`,
})

const createUser = async (params) => {
  const Item = {
    PK: buildKey(`USER-${params.userName}`),
    SK: buildKey(`PROFILE-${params.userName}`),
    ...marshall(params),
  }

  try {
    return dbClient.send(
      new PutItemCommand({
        Item,
        TableName,
      })
    )
  } catch (err) {
    console.error({ err })
  }
}

const createTicket = (params) => {
  const Item = {
    PK: buildKey(`USER-${params.userName}`),
    SK: buildKey(`TICKET-${uuid()}`),
    ...marshall(params),
  }

  try {
    return dbClient.send(
      new PutItemCommand({
        Item,
        TableName,
      })
    )
  } catch (err) {
    console.error({ err })
  }
}

const getUser = async (params) => {
  const Key = {
    PK: buildKey(`USER-${params.userName}`),
    SK: buildKey(`PROFILE-${params.userName}`),
  }

  try {
    const response = await dbClient.send(
      new GetItemCommand({
        Key,
        TableName,
        ConsistentRead: true,
      })
    )

    return unmarshall(response.Item)
  } catch (err) {
    console.error({ err })
  }
}

const getUserTickets = () => {}

const getUserAndTickets = () => {}

module.exports = {
  getUser,
  createUser,
  createTicket,
  getUserTickets,
  getUserAndTickets,
}
