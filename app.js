// Only outputs
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , i2c = require('i2c')
  , iocon = 0x0A
  , iodirA = 0x00 //Pin direction register
  , iodirB = 0x01
  , olatA = 0x14 //output register
  , olatB = 0x15 
  , data = '""'
  , debug = true
  , outIC1 = 0
  , outIC2 = 0
  , chip = 0
  , chipO = {}
  , chipList = []
  , devices = [0x20, 0x21, 0x22]
  , outputs = {
      Liv1:       [0x20, olatA, 1],   Gang_st:    [0x20, olatB, 1],
      Liv2:       [0x20, olatA, 4],   Badk:       [0x20, olatB, 2],
      Gang1_2:    [0x20, olatA, 8],   CV_lok:     [0x20, olatB, 4],
      Traphal:    [0x20, olatA, 16],  Keuken:     [0x20, olatB, 8],
      Kelder:     [0x20, olatA, 32],  Slk:        [0x20, olatB, 128],
      All_u:      [0x21, olatA, 1],   GarPoVo:    [0x21, olatB, 64],
      All_a:      [0x21, olatA, 2],   GarPoAch:   [0x21, olatB, 128],
      Gar3V:      [0x21, olatA, 16],
      Gar2M:      [0x21, olatA, 32],
      Gar1A:      [0x21, olatA, 64],  
      Picam:      [0x22, olatA, 1],   Versterker: [0x22, olatB, 64],
      Zw_ka_lamp: [0x22, olatA, 4],   Tuner:      [0x22, olatB, 128],
      Bapi_230V:  [0x22, olatA, 16],
      PiGergB:    [0x22, olatA, 64],
    } ;

function setupDevices() {
  devices.forEach(function(entry) { // werkt 
    chipList[entry] = new i2c(entry)
    chipList[entry].writeBytes(iocon, [0x00], function(err) { });
    chipList[entry].writeBytes(iodirA,[0x00], function(err) { });
    chipList[entry].writeBytes(iodirB,[0x00], function(err) { });
    chipList[entry].writeBytes(olatA, [0x00], function(err) { });
    chipList[entry].writeBytes(olatB, [0x00], function(err) { });
  });
  return chipList;
}

			/*function setupButtons() {
			  Object.keys(outputs).forEach(function(entry) {
			    var b = document.createElement("BUTTON");
			    var t = document.createTextNode(entry);
			    b.appendChild(t);
			    document.body.appendChild(b);
			  });
			}*/

function aan(chip,kant,bit){
  chipList[chip].writeBytes(kant, [bit], function(err) { });
}

function uit(chip, kant) {
  chipList[chip].writeBytes(kant, [0], function(err) { });
}

function puls(naam){
  output = outputs[naam];
  console.log ('output = ' + output);
  aan(output[0], output[1], output[2]);
  setTimeout(function() { uit(output[0], output[1]); },500); // setTimeout altijd gebruiken met function, anders werkt het niet???
}

//init
setupDevices();

app.listen(8085);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
          res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {   console.log('connected');   
  socket.on('button update event', function (data) {
    console.log('App.js button = ' + data.button);
      switch (data.button)
      {
        case "Liv1" :
          puls(data.button); //je kunt ook aan gebruiken ...
          break;
        default :
          console.log('in default');
          puls(data.button);
      }
      io.emit('ack button status', { button: data.button });
  });
  console.log('io.socket.connection');
});
