/**
 * Calls Flespi API to get the list of all connected devices
 */
export async function getDeviceList (): Promise<Device[]> {
    // Token from .env needed to authenticate in Flespi
    const token: string = "FlespiToken " + process.env.FLESPI_KEY;
    // Get the data via the API

    const pendingResponse = await fetch(
        "https://flespi.io/gw/devices/all",
        {
            headers: {
                Authorization: token
            }
        }
    );
    const json = await pendingResponse.json();
    // Ignore data we don't need and extracts name and id
    return json.result.map((device: any) => ({
        name: device.name,
        id: device.configuration.ident
    }));
}
