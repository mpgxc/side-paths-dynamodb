const dynamodb = require('./dynamodb')

dynamodb.createUser({
  address: 'Rua. Paulo Bernardino',
  email: 'garcia@email.com',
  fullName: 'Mateus Garcia',
  userName: 'mpgxc',
  age: 26,
}).then()

dynamodb.createTicket({
  userName: 'mpgxc',
  title: 'Titulo do ticket',
  body: 'Corpo do ticket',
  status: true,
}).then()

dynamodb
  .getUser({
    userName: 'mpgxc',
  })
  .then(console.log)

dynamodb
  .getUserTickets({
    userName: 'mpgxc',
  })
  .then(console.log)

dynamodb
  .getUserAndTickets({
    userName: 'mpgxc',
  })
  .then(console.log)
