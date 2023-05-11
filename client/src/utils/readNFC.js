import NfcManager, { NfcTech,Ndef } from 'react-native-nfc-manager';

NfcManager.start();

async function readNFC() {
  try {
    // register for the NFC tag with NDEF in it
    await NfcManager.requestTechnology(NfcTech.Ndef);
    // the resolved tag object will contain `ndefMessage` property
//    const tag = await NfcManager.getTag();

   const ndef = await NfcManager.ndefHandler.getNdefMessage();
   const payload = ndef.ndefMessage[0].payload;
   const tagUuid = String.fromCharCode(...payload);

    return tagUuid;
  } catch (error) {
    console.log(error);
  } finally {
    // stop the nfc scanning
    NfcManager.cancelTechnologyRequest();
  }
}

export default readNFC;
