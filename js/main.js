const name = document.querySelector(".connect")
const filter = { usbVendorId: 0xAC90 };
let port = null;

async function connectCom() {
  port = await navigator.serial.requestPort({ filters: [filter] });
  await port.open({ baudRate: 9600 });
  while (port.readable) {
    const reader = port.readable.getReader();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        if (value) {
          console.log(value);
        }
      }
    } catch (error) {
      // TODO: Handle non-fatal read error.
    }
  }
  await port.close();
}

// Check to see what ports are available when the page loads.
document.addEventListener('DOMContentLoaded', async () => {
  let ports = await navigator.serial.getPorts();
  console.log(ports);
});

navigator.serial.addEventListener('connect', async e => {
  // Add |e.target| to the UI or automatically connect.
  console.log("Connect")
});

navigator.serial.addEventListener('disconnect', async e => {
  // Remove |e.target| from the UI. If the device was open the
  // disconnection can also be observed as a stream error.
  console.log("Disconnect")
  //await port.close();
});

async function readBar() {
  while (port.readable) {
    const reader = port.readable.getReader();

    try {
      while (true) {
        const {value, done} = await reader.read();
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        if (value) {
          console.log(value);
        }
      }
    } catch (error) {
      // TODO: Handle non-fatal read error.
    }
  }
}


