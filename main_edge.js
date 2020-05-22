const storageName = "iothwstorage";
const tableName = "edgeDeployTable";
const storageKey = "n5HKjzCke43NekIuvHiZMMJKvFZ6HLNDBIhb3vcMhlmMqfIBuQwScGRfZy4dEFDjNUEVDElWKCv2ek+Jz4bo7w==";

function genRequest(uri) {
    var date = (new Date()).toUTCString();
    var strToSign = date + "\n/"+storageName+"/"+tableName;
    var secret = CryptoJS.enc.Base64.parse(storageKey);
    var hash = CryptoJS.HmacSHA256(strToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    var auth = "SharedKeyLite "+storageName+":" + hashInBase64;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", uri, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("x-ms-date", date);
    xhr.setRequestHeader("x-ms-version", "2019-07-07");
    xhr.setRequestHeader("Authorization", auth);
    return xhr;

}

function sendToHub(activity) {
    var date = Date.now();
    var msg = {
        "activity": activity,
        "PartitionKey": Math.floor(date / (24 * 60 * 60 * 1000)) + '',
        "RowKey": date + ''
    };

    var msg_json = JSON.stringify(msg);
    var xhr = genRequest("https://"+storageName+".table.core.windows.net/"+tableName);
    xhr.send(msg_json);
    
}
