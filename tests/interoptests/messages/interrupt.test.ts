import {deepEqual, runCommand} from "../helpers";
import {JSONSerializer} from "../../../lib/serializers/json";
import {CBORSerializer} from "../../../lib/serializers/cbor";
import {MsgPackSerializer} from "../../../lib/serializers/msgpack";
import {Interrupt, InterruptFields} from "../../../lib/messages/interrupt";

function isEqual(msg1: Interrupt, msg2: any): boolean {
    return (
        msg1.requestID === msg2.requestID &&
        deepEqual(msg1.options, msg2.options)
    );
}

describe('Message Serializer', function () {

    it('JSON Serializer', async function () {
        const interrupt = new Interrupt(new InterruptFields(1, {"a": "b"}));
        const command = `wampproto message interrupt ${interrupt.requestID} -o a=b --serializer json`;

        const output = await runCommand(command);

        const serializer = new JSONSerializer();
        const message = serializer.deserialize(output);

        expect(isEqual(interrupt, message)).toBeTruthy();
    });

    it('CBOR Serializer', async function () {
        const interrupt = new Interrupt(new InterruptFields(1, {"a": "b"}));
        const command = `wampproto message interrupt ${interrupt.requestID} -o a=b --serializer cbor --output hex`;

        const output = await runCommand(command);
        const outputBytes = Buffer.from(output, 'hex');

        const serializer = new CBORSerializer();
        const message = serializer.deserialize(outputBytes);

        expect(isEqual(interrupt, message)).toBeTruthy();
    });

    it('MsgPack Serializer', async function () {
        const interrupt = new Interrupt(new InterruptFields(1, {"a": "b"}));
        const command = `wampproto message interrupt ${interrupt.requestID} -o a=b --serializer msgpack --output hex`;

        const output = await runCommand(command);
        const outputBytes = Buffer.from(output, 'hex');

        const serializer = new MsgPackSerializer();
        const message = serializer.deserialize(outputBytes);

        expect(isEqual(interrupt, message)).toBeTruthy();
    });
});
