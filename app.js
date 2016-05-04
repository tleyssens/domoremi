var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , path = require('path')
  , i2c = require('i2c')
  , iocon = 0x0A
  , iodirA = 0x00 , iodirB = 0x01//Pin direction register  
  , gpioA = 0x12  , gpioB = 0x13 //input register
  , olatA = 0x14  , olatB = 0x15//output register
  , data = '""'
  , debug = true
  , chip = 0
  , chipList = []
  , devices = {
      ic1 : [0x20, 0x00], // outputs
      ic2 : [0x21, 0x00],
      ic3 : [0x22, 0x00],
      ic4 : [0x23, 0xff], // inputs
      ic5 : [0x24, 0xff],
      ic6 : [0x25, 0xff],
      ic7 : [0x26, 0xff]
  }
  , outputs = {
      Living1:       [0x20, olatA, 1],   Gang_st:    [0x20, olatB, 1],
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
    } 
    , inputs = 0
    , inputs1 = {}
    , chatMsg = [];

function setupDevices() {
    //console.log(Object.keys(devices));
  Object.keys(devices).forEach(function(entry) {
      //console.log(devices[entry]);
    var ic = devices[entry];
      //console.log(ic[0]);
      //devices[entry].forEach(function(ic) {
      //  console.log(ic);
      //});
    chipList[ic[0]] = new i2c(ic[0]);
    chipList[ic[0]].writeBytes(iocon, [0x00], function(err) { if(err) {console.log('error iocon ' + err)}});
    chipList[ic[0]].writeBytes(iodirA,[ic[1]], function(err) { if(err) {console.log('error iodirA ' + err)}});
    chipList[ic[0]].writeBytes(iodirB,[ic[1]], function(err) { if(err) {console.log('error iodirB ' + err)}});
    if (ic[1] == 0x00) {
      console.log(entry + ' = output');
      chipList[ic[0]].writeBytes(olatA, [ic[1]], function(err) { if(err) {console.log('error olatA ' + err)}});
      chipList[ic[0]].writeBytes(olatB, [ic[1]], function(err) { if(err) {console.log('error olatB ' + err)}});
    };
    if (ic[1] == 0xff) {
      console.log(entry + ' = input');
      chipList[ic[0]].writeBytes(gpioA, [ic[1]], function(err) { if(err) {console.log('error gpioA ' + err)}});
      chipList[ic[0]].writeBytes(gpioB, [ic[1]], function(err) { if(err) {console.log('error gpioB ' + err)}});
    };
  });
  return chipList;
}

function aan(chip,kant,bit) {
  console.log('in aan');
  chipList[chip].writeBytes(kant, [bit], function(err) { if(err) {console.log('error aan ' + err)}});
}

function uit(chip, kant) {
  console.log('in uit');
  chipList[chip].writeBytes(kant, [0], function(err) { if(err) {console.log('error uit ' + err)}});
}

function puls(naam){
  output = outputs[naam];
  console.log ('output = ' + output);
  aan(output[0], output[1], output[2]);
  setTimeout(function() { uit(output[0], output[1]); },500); // setTimeout altijd gebruiken met function, anders werkt het niet???
}

function leesInputs() {
  console.log('in leesInputs');
  Object.keys(devices).forEach(function(entry) {
      //console.log(devices[entry]);
    var ic = devices[entry];
      //console.log(ic[0]);
      //devices[entry].forEach(function(ic) {
      //  console.log(ic);
      //});
    if (ic[1] == 0xff) {
      var inputs = chipList[ic[0]].readBytes(gpioA, 2,  function(err) { if(err) {console.log('error gpioA ' + err)}});
      //console.log(entry + ' = ' + input[0].toString(2) + '; ' + input[1].toString(2));  
      var n1 = inputs[0].toString(2);
      var n2 = inputs[1].toString(2);
      console.log(entry + ' = ' + "00000000".substr(n1.length)+ n1 + '; ' + "00000000".substr(n2.length)+ n2);
      var inputstring = (entry + ' = ' + "00000000".substr(n1.length)+ n1 + '; ' + "00000000".substr(n2.length)+ n2);
      inputs1[entry] = inputstring;

    };
  });
  return inputs1;
  //var t1 = document.createTextNode(input[1].toString(2));  
}

function exit() {
  console.log('bye');
  process.exit();
}

//init
setupDevices();
//setup listening port
app.listen(8085);
//serving index.html
function handler (req, res) {
  /*fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
          res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });*/
  var filePath = req.url;
  if (filePath == '/')
    filePath = '/index.html';

  filePath = __dirname+filePath;
  var extname = path.extname(filePath);
  var contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        }
        else {                   
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');                  
        }
      });
    }
  });  
}

io.sockets.on('connection', function (socket) {   
  console.log('connected'); 
  io.emit('buttonlist', outputs ); 
  io.emit('OldMsg', chatMsg );
  //if button pressed => react  
  socket.on('button update event', function (data) {
    console.log('App.js button = ' + data.button);
      switch (data.button)
      {
        case "Liv1" :
          puls(data.button); //je kunt ook aan gebruiken ...
          break;
        case "Inputs lezen" :
          console.log('inputs lezen gedrukt');
          var inp = leesInputs();
          io.emit('inputUpdate', inp);
          break;
        default :
          console.log('in default');
          puls(data.button);
      }
      io.emit('ack button status', { button: data.button });
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    chatMsg.push(msg);
    console.log(chatMsg);
  });
  console.log('io.socket.connection');
});

process.on('SIGINT', exit);

