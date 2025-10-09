import UartService from "./communication/UartService";

export type BLEDeviceWithUartService = { device: BluetoothDevice, service: UartService };

export const getBLEDeviceWithUartService = async (
  bluetooth: Bluetooth, ...filters: BluetoothLEScanFilter[]
): Promise<BLEDeviceWithUartService | { error: string }> => {
  const device = await bluetooth.requestDevice({
    filters: [
      ...(filters ?? []),
      {
        services: [UartService.uuid]
      },
    ],
  });
  if (!device) return { error: "No device selected" };
  if (!device.gatt) return { error: "No GATT server found" };
  if (!device.gatt.connected) await device.gatt.connect();
  const services = await device.gatt.getPrimaryServices();
  const found = services.find((service) => service.uuid === UartService.uuid);
  if (!found) return { error: "UART service not found" };
  const service = await UartService.create(found);
  return { device, service };
}
