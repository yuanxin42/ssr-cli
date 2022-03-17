// 获取本地 ip 地址（因为 wise 站点，用 ip 地址方便手机扫码）
function getIPAdress() {
    let interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];

            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

exports.ssrPort = 8813;

exports.ip = getIPAdress();

exports.devPort = 8814;

