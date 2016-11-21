console.log('hello');

const rabbitTemplate = require('./rabbit');
rabbitTemplate.send('hello1!', 'test');
// rabbitTemplate.send('hello2!');