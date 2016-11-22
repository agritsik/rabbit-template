const amqp = require('amqplib');
const co = require('co');

class RabbitTemplate {
    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }
    get queueName() {
        return this._queueName;
    }

    set queueName(value) {
        this._queueName = value;
    }
    get exchange() {
        return this._exchange;
    }

    set exchange(value) {
        this._exchange = value;
    }

    constructor(url, exchange, queueName) {
        this._url = url;
        this._exchange = exchange;
        this._queueName = queueName;
    }

    send(message) {
        co(this._send(message));
    }

    *_send(message) {
        let connection = yield amqp.connect(this._url);
        let ch = yield connection.createChannel();
        yield ch.assertExchange(this.exchange, 'fanout', {durable: false});

        ch.publish(this.exchange, '', new Buffer(message));
        console.log(" [x] Sent '%s'", message);
        // ch.close();
        // connection.close();
    }

    receive(cb) {
        co(this._receive(cb));
    }

    *_receive(cb) {
        let connection = yield amqp.connect(this._url);
        let ch = yield connection.createChannel();
        yield ch.assertExchange(this.exchange, 'fanout', {durable: false});

        let q = yield ch.assertQueue('', {exclusive: true});
        yield ch.bindQueue(q.queue, this.exchange, '')

        ch.consume(q.queue, cb, {noAck: true});
    }

}

module.exports = new RabbitTemplate('amqp://192.168.99.100', 'test:events');
