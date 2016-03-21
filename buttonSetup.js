var olatA = 0x14 //output register
  , olatB = 0x15 
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
   }
function buttonList() {
  Object.keys(outputs).forEach(function(entry) {
    console.log('In functie buttonList');
    //buttons
        var d = document.createElement("div");
        d.className="col-xs-3";
        var b = document.createElement("BUTTON");
        var t = document.createTextNode(entry);
        b.setAttribute('id' , entry);
        b.type ="button";
        b.className="btn btn-block btn-primary";
        b.setAttribute('onclick',' this.blur(); toggle(this.id)'); //blur is om focus weg te doen
        b.appendChild(t);
        d.appendChild(b);
        document.getElementById('buttons').appendChild(d);
    //checkboxen          
    /*var l = document.createElement("label");
    l.className="btn btn-primary col-xs-3";
    var c = document.createElement("input");
    var t1 = document.createTextNode(entry);
    c.type = "checkbox";
    c.autocomplete = "off";
    l.id = entry;
    l.setAttribute('onclick','toggle(this.id)');
    l.appendChild(c);
    l.appendChild(t1);
    document.getElementById('buttons1').appendChild(l);*/
    });
  var l = document.createElement("label");
  l.className="btn btn-primary col-xs-12";
  var c = document.createElement("input");
  var t1 = document.createTextNode('Inputs lezen');
  c.type = "checkbox";
  c.autocomplete = "off";
  l.id = 'Inputs lezen';
  l.setAttribute('onclick','toggle(this.id)');
  l.appendChild(c);
  l.appendChild(t1);
  document.getElementById('inputs').appendChild(l);
}
