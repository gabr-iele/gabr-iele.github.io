var Protocol = require('azure-iot-device-mqtt').MqttWs;
var sdk = require('azure-iot-device');


const connString = "HostName=homework-hub.azure-devices.net;DeviceId=pydevhw;SharedAccessKey=yRlZ48tiRxpSE1fOgX6i72D+kmf2PwGqa3SYy90zXTE=";
var client = sdk.Client.fromConnectionString(connString, Protocol);

function sendMsg(x,y,z) {
    var msg_json = {
        x: x,
        y: y,
        z: z
    };
    var msg = new sdk.Message(JSON.stringify(msg_json));
    client.sendEvent(msg, function(err) {
        if(err) console.log("Error: "+err.toString());
        else console.log("Sent msg: {x: "+x+", y: "+y+", z: "+z+"}");
    })
}