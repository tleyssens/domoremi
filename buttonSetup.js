var olatA = 0x14 //output register
  , olatB = 0x15 
  
function buttonList(outputs) {
  Object.keys(outputs).forEach(function(entry) {
    console.log('In functie buttonList');
    //buttons
        var d = document.createElement("div");
        d.className="col-xs-4 col-md-4";
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
  var d1 = document.createElement("div");
  d1.className="col-md-2";
  var l = document.createElement("label");
  l.className="btn btn-primary";
  var c = document.createElement("input");
  var t1 = document.createTextNode('Inputs lezen');
  c.type = "checkbox";
  c.autocomplete = "off";
  l.id = 'Inputs lezen';
  l.setAttribute('onclick','toggle(this.id)');
  l.appendChild(c);
  l.appendChild(t1);
  d1.appendChild(l);
  document.getElementById('inputs').appendChild(d1);
}
