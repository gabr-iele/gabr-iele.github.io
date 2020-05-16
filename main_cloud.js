const hubName = "homework-hub.azure-devices.net";
const device_id = "pydevhw";
const subTopic = "devices/"+device_id+"/messages/devicebound/#";
const pubTopic = "devices/"+device_id+"/messages/events/";
const hubKey = "yRlZ48tiRxpSE1fOgX6i72D+kmf2PwGqa3SYy90zXTE=";

var client;

function gen_sas_token(uri, key, expiry=60) {
    resourceUri = encodeURIComponent(uri);

    // Set expiration in seconds
    var expires = (Date.now() / 1000) + expiry * 60;
    expires = Math.ceil(expires);
    var toSign = resourceUri + '\n' + expires;

    // Use crypto
    var hmac = CryptoJS.HmacSHA256(toSign, CryptoJS.enc.Base64.parse(key));
    var base64UriEncoded = CryptoJS.enc.Base64.stringify(hmac);

    // Construct authorization string
    var token = "SharedAccessSignature sr=" + resourceUri + "&sig=" + base64UriEncoded + "&se=" + expires;
    return token;
}

function startConnect() {

    client = new Paho.MQTT.Client(hubName, Number(443), device_id);

    // Set callback handlers
    client.onMessageArrived = onMessageArrived;

    // Connect the client, if successful, call onConnect function
    client.connect({
        onSuccess: onConnect,
        useSSL: true,
        userName: hubName+"/"+device_id,
        password: gen_sas_token(hubName+"/devices/"+device_id, hubKey)
    });
    var msg = new Paho.MQTT.Message("POPOPO");
    msg.destinationName = pubTopic;
    msg.qos = 0;
    client.send(msg);
}

function onConnect() {
    console.log("Connected to Azure broker");
    client.subscribe(subTopic);
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("Message arrived: " + message.payloadString);
}

// Called when the disconnection button is pressed
function startDisconnect() {
    client.disconnect();
}