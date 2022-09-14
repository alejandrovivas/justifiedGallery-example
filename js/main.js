const name = document.querySelector(".connectCom")
const filter = { usbVendorId: 0xAC90 };

async function connectCom() {
  const port = await navigator.serial.requestPort({ filters: [filter] });
  await readBar(port);
}

// Check to see what ports are available when the page loads.
document.addEventListener('DOMContentLoaded', async () => {
  let allowedPorts = await navigator.serial.getPorts();
  console.log(allowedPorts)
  if (allowedPorts.length===0){
    console.log("No serial port Connected")
  }else {
    await readBar(allowedPorts[0]);
  }
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

async function readBar(openPort) {
  const PUB_SDK_MARK= 'PubDSK_';
  await openPort.open({ baudRate: 9600 });
  while (openPort.readable) {
      try {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = openPort.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            // Allow the serial port to be closed later.
            reader.releaseLock();
            break;
          }
          if (value) {
            if (value.search(PUB_SDK_MARK)>0){
              const array = Array.from(value)
              let idNumber = array.slice(48, 58);
              let firstName = array.slice(104, 127);
              let secondName = array.slice(127, 150);
              let lastName = array.slice(58, 80);
              let secondLastName = array.slice(81, 104);
              let gender = array.slice(151, 152);
              let yearBirth = array.slice(152, 156);
              let monthBirth = array.slice(156, 158);
              let dayBirth = array.slice(158, 160);
              let birthDate = yearBirth.join('') +'-' +monthBirth.join('') +'-'+ dayBirth.join('')
              let region = array.slice(162, 165);
              let city = array.slice(160, 162);
              let bloodType = array.slice(166, 168);

              console.log(idNumber.join(''));
              console.log(firstName.join(''))
              console.log(secondName.join(''))
              console.log(lastName.join(''))
              console.log(secondLastName.join(''))
              console.log(gender.join(''))
              console.log(birthDate)
              console.log(region.join(''))
              console.log(city.join(''))
              console.log(bloodType.join(''))
            }
          }
        }
      } catch (error) {
        console.log(error)
        // TODO: Handle non-fatal read error.
      }
    }
}


