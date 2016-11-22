const rabbitTemplate = require('./rabbit');

rabbitTemplate.receive(m=>console.log(`Receive: ${m}`));

setTimeout(()=>rabbitTemplate.send('hello1!'),1000);
