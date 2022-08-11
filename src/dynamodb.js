const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')

const client = new DynamoDBClient({
  region: 'us-east-1',
})

const TableName = 'application-table'
const buildPartitionKey = (param) => ({
  S: `USER-${param}`,
})

const buildSortKey = (param) => ({
  S: `PROFILE-${param}`,
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
    PK: buildPartitionKey(params.userName),
    SK: buildSortKey(params.userName),
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

createUser({
  address: 'Rua. Paulo Bernardino',
  email: 'garcia@email.com',
  fullName: 'Mateus Garcia',
  userName: 'mpgxc',
  age: 26,
}).then()

const createTicket = () => {}

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
