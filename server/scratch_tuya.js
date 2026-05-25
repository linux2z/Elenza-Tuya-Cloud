const { TuyaContext } = require('@tuya/tuya-connector-nodejs');

const tuya = new TuyaContext({
  baseUrl: 'https://openapi.tuyaeu.com',
  accessKey: 'yex8ug3qk7uanmjwfrxx',
  secretKey: 'b90bd2eb6b7c4059bfe1b4d39ccf6147',
});

async function discover() {
  try {
    console.log("Fetching devices for project p1778061682233g3ph5k...");
    const res = await tuya.request({
      method: 'GET',
      path: '/v1.0/iot-03/project/devices?project_code=p1778061682233g3ph5k&page_no=1&page_size=20',
    });
    console.log("Devices Response:", JSON.stringify(res, null, 2));

    if (res.result && res.result.devices && res.result.devices.length > 0) {
        const deviceId = res.result.devices[0].id;
        console.log(`\nFetching specs for device: ${deviceId}`);
        const specs = await tuya.request({
            method: 'GET',
            path: `/v1.0/iot-03/devices/${deviceId}/specifications`
        });
        console.log("Specifications:", JSON.stringify(specs, null, 2));

        console.log(`\nFetching status for device: ${deviceId}`);
        const status = await tuya.request({
            method: 'GET',
            path: `/v1.0/iot-03/devices/${deviceId}/status`
        });
        console.log("Status:", JSON.stringify(status, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

discover();
