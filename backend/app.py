from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Devices dosyasını oku
def read_devices():
    with open('devices.json') as f:
        return json.load(f)

# Devices dosyasını yaz
def write_devices(devices):
    with open('devices.json', 'w') as f:
        json.dump(devices, f, indent=4)

# Tüm cihazları getir
@app.route('/devices', methods=['GET'])
def get_devices():
    devices = read_devices()
    return jsonify(devices)

# Cihaz durumunu değiştir (toggle)
@app.route('/devices/<device_id>/toggle', methods=['POST'])
def toggle_device(device_id):
    devices = read_devices()
    if device_id in devices:
        devices[device_id]["status"] = not devices[device_id]["status"]
        write_devices(devices)
        return jsonify({"message": f"{device_id} toggled."})
    else:
        return jsonify({"error": "Device not found"}), 404

# Yeni cihaz ekle
@app.route('/devices', methods=['POST'])
def add_device():
    devices = read_devices()
    data = request.json
    if not data or 'name' not in data or 'type' not in data:
        return jsonify({'error': 'Invalid device data'}), 400

    # Yeni cihaz ID'si üret
    new_id = f"device{len(devices) + 1}"

    devices[new_id] = {
        "name": data['name'],
        "type": data['type'],
        "status": False
    }

    write_devices(devices)
    return jsonify({"message": "Device added", "id": new_id}), 201

# Cihaz sil
@app.route('/devices/<device_id>', methods=['DELETE'])
def delete_device(device_id):
    devices = read_devices()
    if device_id in devices:
        del devices[device_id]
        write_devices(devices)
        return jsonify({"message": "Device deleted"}), 200
    else:
        return jsonify({"error": "Device not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
