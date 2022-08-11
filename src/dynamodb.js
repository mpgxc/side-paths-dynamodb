const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const { v4: uuid } = require('uuid')

const client = new DynamoDBClient({
  region: 'us-east-1',
})

const TableName = 'application-table'
const buildKey = (param) => ({
  S: `${param}`,
})

const parseParams = (param) =>
  ({
    string: { S: param },

    /**
     * Resolvendo problema da conversão de números
     * https://stackoverflow.com/questions/71488712/number-value-cannot-be-converted-to-string-when-updating-item
     * */

    number: { N: `${param}` },
    boolean: { BOOL: param },
    object: { M: param },
    array: { L: param },
    null: { NULL: param },
  }[typeof param])

const buildParams = (params) =>
  Object.assign(
    {},
    ...Object.keys(params).map((index) => ({
      [index]: parseParams(params[index]),
    }))
  )

const createUser = async (params) => {
  const Item = {
    PK: buildKey(`USER-${params.userName}`),
    SK: buildKey(`PROFILE-${params.userName}`),
    ...buildParams(params),
  }

  try {
    return client.send(
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
    ...buildParams(params),
  }

  try {
    return client.send(
      new PutItemCommand({
        Item,
        TableName,
      })
    )
  } catch (err) {
    console.error({ err })
  }
}

const getUser = () => {}

const getUserTickets = () => {}

const getUserAndTickets = () => {}

module.exports = {
  createUser,
  createTicket,
  getUser,
  getUserTickets,
  getUserAndTickets,
}
