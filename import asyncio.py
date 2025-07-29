import asyncio
import httpx
from bleak import BleakClient
from ftms_decoder import parse_ftms_indoor_bike  # Assume similar logic for ski/rower too

API_URL = "http://127.0.0.1:8000/data"

# Devices to connect to (address, device_id, type)
DEVICES = [
    ("D7231545-6C27-E59A-82C1-BC1013B37F0C", "PM5 432099846", "bike")
]

FTMS_CHARACTERISTIC_UUID = "00002ad2-0000-1000-8000-xyz"

http_client = httpx.AsyncClient()

def make_handler(device_id, device_type):
    async def handler(sender, data):
        parsed = parse_ftms_indoor_bike(data)  # Ideally detect type or parse accordingly
        if parsed:
            payload = {
                "device_id": device_id,
                "device_type": device_type,
                "data": parsed
            }
            try:
                await http_client.post(API_URL, json=payload)
                print(f"📤 Sent from {device_id}:", parsed)
            except Exception as e:
                print(f"❌ Failed to send from {device_id}:", e)
    return handler

async def connect_and_listen(address, device_id, device_type):
    handler = make_handler(device_id, device_type)
    while True:
        try:
            print(f"🔌 Connecting to {device_id} at {address}")
            async with BleakClient(address) as client:
                if client.is_connected:
                    print(f"✅ Connected to {device_id}")
                    await client.start_notify(FTMS_CHARACTERISTIC_UUID, handler)
                    while client.is_connected:
                        await asyncio.sleep(1)
            print(f"⚠️ Disconnected from {device_id}. Retrying...")
        except Exception as e:
            print(f"❌ BLE error on {device_id}: {e}")
        await asyncio.sleep(5)

async def main():
    await asyncio.gather(*(connect_and_listen(*device) for device in DEVICES))

asyncio.run(main())
