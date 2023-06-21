// for I2C Communication
#include <Wire.h>
#include <PN532.h>
#include <PN532_I2C.h>
#include <NfcAdapter.h>
#include <Servo.h>
PN532_I2C pn532_i2c(Wire);
NfcAdapter nfc = NfcAdapter(pn532_i2c);

int flag=0;
uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
uint8_t uidLength;
String tagId = "None";
String password = "";
byte nuidPICC[7];



const int pwmPin = 6; 


void setup() {
  Serial.begin(115200);
  delay(1000);
  nfc.begin();
  pinMode(pwmPin,OUTPUT);
  digitalWrite(pwmPin, LOW);
  delay(500);
  digitalWrite(pwmPin, HIGH);
  delay(500);
  digitalWrite(pwmPin, LOW);
  Serial.println("System initialized");
  Serial.println("System work and wait for scan");
  open_lock();
}

void loop() {
  delay(100);
  delay(100);
  password=readNFC(password);
  delay(100);
  authenticate(password,"True password");


}

String readNFC(String password){
  password="";
  if (nfc.tagPresent()){
    Serial.println("tag present");
    NfcTag tag = nfc.read();

    if (tag.hasNdefMessage()) { // if the NFC tag has a message
      NdefMessage message = tag.getNdefMessage();
      int recordCount = message.getRecordCount();
      for (int i = 0; i < recordCount; i++) {
        NdefRecord record = message.getRecord(i);
        int payloadLength = record.getPayloadLength();
        byte payload[payloadLength];
        record.getPayload(payload);
        password=PassHexChar(payload, payloadLength);
        }
    }
    return password;
  }
  return "";
}


// Borrowed from Adafruit_NFCShield_I2C
String PassHexChar(const byte * data, const long numBytes)
{ String password = "";
  uint32_t szPos;
  for (szPos=0; szPos < numBytes; szPos++)
  {
    if (data[szPos] <= 0x1F)
      Serial.print(".");
    else
      password+=((char)data[szPos]);
  }
  Serial.println(password);
  return password;
}

void authenticate(String string1,String string2) {
  if (string1 == string2) {
    open_lock();
  }
}
void open_lock(){
  digitalWrite(pwmPin, HIGH);
  delay(1000);
  digitalWrite(pwmPin, LOW);       
}

  

