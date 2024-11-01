{ path: "/tr=103.67.79.230:443", proxy: "103.67.79.230:443" },  
  { path: "/tr=203.194.112.119:8443", proxy: "203.194.112.119:8443" },
  { path: "/tr=111.95.40.14:32414", proxy: "111.95.40.14:32414" },
  { path: "/tr=103.186.1.209:8443", proxy: "103.186.1.209:8443" },
  { path: "/tr=35.219.50.99:443", proxy: "35.219.50.99:443" },
  { path: "/tr=35.219.15.90:443", proxy: "35.219.15.90:443" },
  { path: "/tr=210.186.12.244:443", proxy: "210.186.12.244:443" },
  { path: "/tr=166.88.35.141:443", proxy: "166.88.35.141:443" },
  { path: "/tr=167.71.194.185:8443", proxy: "167.71.194.185:8443" },
  { path: "/tr=89.34.227.166:8443", proxy: "89.34.227.166:8443" },
  { path: "/tr=45.77.36.40:443", proxy: "45.77.36.40:443" },
  { path: "/tr=43.134.34.18:443", proxy: "43.134.34.18:443" },
  { path: "/tr=103.180.193.56:443", proxy: "103.180.193.56:443" },
  { path: "/tr=164.52.2.100:443", proxy: "164.52.2.100:443" },
  { path: "/tr=51.79.254.182:443", proxy: "51.79.254.182:443" },
  { path: "/tr=104.248.145.216:443", proxy: "104.248.145.216:443" },
  { path: "/tr=185.217.5.3:443", proxy: "185.217.5.3:443" },
  { path: "/tr=129.150.50.63:443", proxy: "129.150.50.63:443" },
  { path: "/tr=185.114.78.230:443", proxy: "185.114.78.230:443" },
  { path: "/tr=194.36.179.237:443", proxy: "194.36.179.237:443" },
  { path: "/tr=52.74.101.26:443", proxy: "52.74.101.26:443" },
  { path: "/tr=143.42.66.91:443", proxy: "143.42.66.91:443" },
  { path: "/tr=178.128.80.43:443", proxy: "178.128.80.43:443" },
  { path: "/tr=38.180.165.29:443", proxy: "38.180.165.29:443" },
  { path: "/tr=185.103.109.139:443", proxy: "185.103.109.139:443" },
  { path: "/tr=31.28.27.38:443", proxy: "31.28.27.38:443" }
import { connect } from 'cloudflare:sockets';

const listProxy = [
    { path: "/tr=103.67.79.230:443", proxy: "103.67.79.230:443" },  
  { path: "/tr=203.194.112.119:8443", proxy: "203.194.112.119:8443" },
  { path: "/tr=111.95.40.14:32414", proxy: "111.95.40.14:32414" },
  { path: "/tr=103.186.1.209:8443", proxy: "103.186.1.209:8443" },
  { path: "/tr=35.219.50.99:443", proxy: "35.219.50.99:443" },
  { path: "/tr=35.219.15.90:443", proxy: "35.219.15.90:443" },
  { path: "/tr=210.186.12.244:443", proxy: "210.186.12.244:443" },
  { path: "/tr=166.88.35.141:443", proxy: "166.88.35.141:443" },
  { path: "/tr=167.71.194.185:8443", proxy: "167.71.194.185:8443" },
  { path: "/tr=89.34.227.166:8443", proxy: "89.34.227.166:8443" },
  { path: "/tr=45.77.36.40:443", proxy: "45.77.36.40:443" },
  { path: "/tr=43.134.34.18:443", proxy: "43.134.34.18:443" },
  { path: "/tr=103.180.193.56:443", proxy: "103.180.193.56:443" },
  { path: "/tr=164.52.2.100:443", proxy: "164.52.2.100:443" },
  { path: "/tr=51.79.254.182:443", proxy: "51.79.254.182:443" },
  { path: "/tr=104.248.145.216:443", proxy: "104.248.145.216:443" },
  { path: "/tr=185.217.5.3:443", proxy: "185.217.5.3:443" },
  { path: "/tr=129.150.50.63:443", proxy: "129.150.50.63:443" },
  { path: "/tr=185.114.78.230:443", proxy: "185.114.78.230:443" },
  { path: "/tr=194.36.179.237:443", proxy: "194.36.179.237:443" },
  { path: "/tr=52.74.101.26:443", proxy: "52.74.101.26:443" },
  { path: "/tr=143.42.66.91:443", proxy: "143.42.66.91:443" },
  { path: "/tr=178.128.80.43:443", proxy: "178.128.80.43:443" },
  { path: "/tr=38.180.165.29:443", proxy: "38.180.165.29:443" },
  { path: "/tr=185.103.109.139:443", proxy: "185.103.109.139:443" },
  { path: "/tr=31.28.27.38:443", proxy: "31.28.27.38:443" }
 //tambahin sendiri
];
let proxyIP;
export default {
    async fetch(request, ctx) {
        try {
            proxyIP = proxyIP;
            const url = new URL(request.url);
            const upgradeHeader = request.headers.get('Upgrade');
            for (const entry of listProxy) {
                if (url.pathname === entry.path) {
                    proxyIP = entry.proxy;
                    break;
                }
            }
            if (upgradeHeader === 'websocket' && proxyIP) {
                return await trojanOverWSHandler(request);
            }
            const allConfig = await getAllConfigTrojan(request.headers.get('Host'));
            return new Response(allConfig, {
                status: 200,
                headers: { "Content-Type": "text/html;charset=utf-8" },
            });
        } catch (err) {
            return new Response(err.toString(), { status: 500 });
        }
    },
};
async function getAllConfigTrojan(hostName) {
    try {
        let allConfigs = '';
        for (const entry of listProxy) {
            const { path, proxy } = entry;
            const response = await fetch(`https://ipwhois.app/json/${proxy}`);
            const data = await response.json();
            const pathFixed = encodeURIComponent(path);
            const trojanTls = `trojan://BMKG-XYZ\u0040${hostName}:443?security=tls&type=ws&host=${hostName}&sni=${hostName}&fp=random&path=${pathFixed}#${data.isp} (${data.country})`;
        const trojanNtls = `trojan://BMKG-XYZ\u0040${hostName}:80?security=none&type=ws&host=${hostName}&path=${pathFixed}#${data.isp} (${data.country})`;
            const trojanTlsFixed = trojanTls.replace(/ /g, '+');
            const trojanNtlsFixed = trojanNtls.replace(/ /g, '+');
            allConfigs += 
`PATH: ${path}
COUNTRY: ${data.country}
ISP: ${data.isp}
=====================================
TLS:
${trojanTlsFixed}
<button class="button" onclick='copyToClipboard("${trojanTlsFixed}")'><i class="fa fa-clipboard"></i>Copy  </button>
=====================================
NTLS:
${trojanNtlsFixed}
<button class="button" onclick='copyToClipboard("${trojanNtlsFixed}")'><i class="fa fa-clipboard"></i>Copy  </button>
=====================================
`;
}
const htmlConfigs = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TROJAN CLOUDFLARE</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: white;
            background-color: black;
        }
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .button {
            background-color: black;
            color: white;
            border: 2px solid white;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
        }
        .button i {
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <pre>
=====================================
        ALL TROJAN ACCOUNT
=====================================
${allConfigs}
    </pre>
    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert("Copied to clipboard");
                })
                .catch((err) => {
                    console.error("Failed to copy to clipboard:", err);
                });
        }
    </script>
</body>
</html>`;

        return htmlConfigs;
    } catch (error) {
        return "An error occurred while generating the trojan configurations.";
    }
}

async function trojanOverWSHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);
  webSocket.accept();
  let address = "";
  let portWithRandomLog = "";
  const log = (info, event) => {
    console.log(`[${address}:${portWithRandomLog}] ${info}`, event || "");
  };
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";
  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);
  let remoteSocketWapper = {
    value: null,
  };
  let udpStreamWrite = null;
  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (udpStreamWrite) {
            return udpStreamWrite(chunk);
          }
          if (remoteSocketWapper.value) {
            const writer = remoteSocketWapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
          }
          const {
            hasError,
            message,
            portRemote = 443,
            addressRemote = "",
            rawClientData,
          } = await parseTrojanHeader(chunk);
          address = addressRemote;
          portWithRandomLog = `${portRemote}--${Math.random()} tcp`;
          if (hasError) {
            throw new Error(message);
            return;
          }
          handleTCPOutBound(remoteSocketWapper, addressRemote, portRemote, rawClientData, webSocket, log);
        },
        close() {
          log(`readableWebSocketStream is closed`);
        },
        abort(reason) {
          log(`readableWebSocketStream is aborted`, JSON.stringify(reason));
        },
      })
    )
    .catch((err) => {
      log("readableWebSocketStream pipeTo error", err);
    });
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function parseTrojanHeader(buffer) {
  if (buffer.byteLength < 56) {
    return {
      hasError: true,
      message: "invalid data",
    };
  }
  let crLfIndex = 56;
  if (new Uint8Array(buffer.slice(56, 57))[0] !== 0x0d || new Uint8Array(buffer.slice(57, 58))[0] !== 0x0a) {
    return {
      hasError: true,
      message: "invalid header format (missing CR LF)",
    };
  }

  const socks5DataBuffer = buffer.slice(crLfIndex + 2);
  if (socks5DataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid SOCKS5 request data",
    };
  }

  const view = new DataView(socks5DataBuffer);
  const cmd = view.getUint8(0);
  if (cmd !== 1) {
    return {
      hasError: true,
      message: "unsupported command, only TCP (CONNECT) is allowed",
    };
  }

  const atype = view.getUint8(1);
  let addressLength = 0;
  let addressIndex = 2;
  let address = "";
  switch (atype) {
    case 1:
      addressLength = 4;
      address = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(socks5DataBuffer.slice(addressIndex, addressIndex + 1))[0];
      addressIndex += 1;
      address = new TextDecoder().decode(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(socks5DataBuffer.slice(addressIndex, addressIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      address = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${atype}`,
      };
  }

  if (!address) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${atype}`,
    };
  }

  const portIndex = addressIndex + addressLength;
  const portBuffer = socks5DataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: address,
    portRemote,
    rawClientData: socks5DataBuffer.slice(portIndex + 4),
  };
}

async function handleTCPOutBound(remoteSocket, addressRemote, portRemote, rawClientData, webSocket, log) {
  if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addressRemote)) addressRemote = `${atob('d3d3Lg==')}${addressRemote}${atob('LnNzbGlwLmlv')}`;
  async function connectAndWrite(address, port) {
    const tcpSocket2 = connect({
      hostname: address,
      port,
    });
    remoteSocket.value = tcpSocket2;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket2.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();
    return tcpSocket2;
  }
  async function retry() {
    const tcpSocket2 = await connectAndWrite(proxyIP || addressRemote, portRemote);
    tcpSocket2.closed
      .catch((error) => {
        console.log("retry tcpSocket closed error", error);
      })
      .finally(() => {
        safeCloseWebSocket(webSocket);
      });
    remoteSocketToWS(tcpSocket2, webSocket, null, log);
  }
  const tcpSocket = await connectAndWrite(addressRemote, portRemote);
  remoteSocketToWS(tcpSocket, webSocket, retry, log);
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message = event.data;
        controller.enqueue(message);
      });
      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },
    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`readableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    },
  });
  return stream;
}

async function remoteSocketToWS(remoteSocket, webSocket, retry, log) {
  let hasIncomingData = false;
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        async write(chunk, controller) {
          hasIncomingData = true;
          if (webSocket.readyState !== WS_READY_STATE_OPEN) {
            controller.error("webSocket connection is not open");
          }
          webSocket.send(chunk);
        },
        close() {
          log(`remoteSocket.readable is closed, hasIncomingData: ${hasIncomingData}`);
        },
        abort(reason) {
          console.error("remoteSocket.readable abort", reason);
        },
      })
    )
    .catch((error) => {
      console.error(`remoteSocketToWS error:`, error.stack || error);
      safeCloseWebSocket(webSocket);
    });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

let WS_READY_STATE_OPEN = 1;
let WS_READY_STATE_CLOSING = 2;

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}
