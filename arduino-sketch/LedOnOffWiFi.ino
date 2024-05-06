#include <WiFiS3.h>
#include "arduino_secrets.h"
#include "Arduino_LED_Matrix.h"
#define ROWS 8 // Number of rows in the LED matrix
#define COLS 12 // Number of columns in the LED matrix

ArduinoLEDMatrix matrix;

char ssid[] = SECRET_SSID;      // your network SSID (name)
char pass[] = SECRET_PASS;  // your network password
int status = WL_IDLE_STATUS;

WiFiServer server(80);  // create a server at port 80

byte ledMatrix[ROWS][COLS]; // Define your LED matrix configuration

void setup() {
  // initialize serial communication
  Serial.begin(9600);
  matrix.begin();

  for(int i =0;i < ROWS; i++){
    for(int j = 0; j < COLS; j++){
      ledMatrix[i][j] = 0;
    }
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to Network named: ");
    Serial.println(ssid);                   // print the network name (SSID);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(10000);
  }
  server.begin();                           // start the web server on port 80
  printWifiStatus();
}


void loop() {
  // check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // wait until the client sends some data
  Serial.println("New client");
  while (!client.available()) {
    delay(1);
  }

  // read the first line of the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();

  // check if the request is for turning the LED on or off
  if (request.indexOf("/led/on") != -1) {
    changeLED(request, 1);
  } else if (request.indexOf("/led/off") != -1) {
    changeLED(request, 0);
  }

  // send a standard http response header
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");  // the connection will be closed after completion of the response
  client.println();
  // your web page content here

  // the content of the HTTP response follows the header
  client.println("<!DOCTYPE HTML>");
  client.println("<html>");
  // output the led status
  client.print("LED is now: ");
  client.println("<br><br>");
  client.println("<a href=\"/led/on?x=1&y=1\">Turn On LED 1</a><br>");
  client.println("<a href=\"/led/on?x=2&y=2\">Turn On LED 2</a><br>");
  client.println("<a href=\"/led/off\">Turn Off LED</a><br>");
  client.println("</html>");

  // close the connection
  client.stop();

  Serial.println("Client disconnected");
}

void changeLED(String request, int state) {
  // parse parameters
  int xPos = request.indexOf("?x=");
  int yPos = request.indexOf("&y=");
  if (xPos != -1 && yPos != -1) {
    String xStr = request.substring(xPos + 3, yPos);
    String yStr = request.substring(yPos + 3);
    int x = xStr.toInt();
    int y = yStr.toInt();
    Serial.println(x);
    Serial.println(y);
    // Turn on the LED at the specified position
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
      ledMatrix[y][x] = state;
      matrix.renderBitmap(ledMatrix, ROWS, COLS);
    }
  }
}

void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}

