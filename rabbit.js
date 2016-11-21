const amqp = require('amqplib');
const co = require('co');

class RabbitTemplate {

    constructor(url) {
        this._url = 'amqp://192.168.99.100';
    }

    send(message, exchange) {
        co(this._getChannelForExchange(exchange))
            .then(ch=>ch.publish(exchange, '', new Buffer(message)));
    }

    *_getChannelForExchange(exchange) {
        if (exchange == null) throw new Error('Exchange can not be null');

        let connection = yield amqp.connect(this._url);
        let ch = yield connection.createChannel();
        let ok = yield ch.assertExchange(exchange, 'fanout', {durable: false});
        return Promise.resolve(ch);
    }

}

module.exports = new RabbitTemplate();
