const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb')

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

const createTicket = async (params) => {
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
      })
    )

    return unmarshall(response.Item)
  } catch (err) {
    console.error({ err })
  }
}

const getUserTickets = async (params) => {
  const KeyConditionExpression = 'PK = :PK AND begins_with(SK, :SK)'

  const ExpressionAttributeValues = {
    ':PK': buildKey(`USER-${params.userName}`),
    ':SK': buildKey('TICKET-'),
  }

  try {
    const response = await dbClient.send(
      new QueryCommand({
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      })
    )

    return response.Items.map(unmarshall)
  } catch (err) {
    console.error({ err })
  }
}

const getUserAndTickets = async (params) => {
  const KeyConditionExpression = 'PK = :PK'

  const ExpressionAttributeValues = {
    ':PK': buildKey(`USER-${params.userName}`),
  }

  try {
    const response = await dbClient.send(
      new QueryCommand({
        TableName,
        KeyConditionExpression,
        ExpressionAttributeValues,
      })
    )

    const [profile, ...tickets] = response.Items.map(unmarshall)

    return {
      profile,
      tickets,
    }
  } catch (err) {
    console.error({ err })
  }
}

module.exports = {
  getUser,
  createUser,
  createTicket,
  getUserTickets,
  getUserAndTickets,
}
