function cloneObject(THIS, TOTHIS) {
  for (var prop in THIS) {
    TOTHIS[prop] = THIS[prop];
  }
}
function KVP_System(Protected){
  // Generate KVP System via modular pattern (to protect the data)
  var tempObj = (function() {
    var data = {};
    var set = function(key, value) {
      data[key] = value;
    }
    var get = function(key) {
      if (data[key]) {
        return data[key];
      } else {
        return null;
      }
    }
    var remove = function(key) {
      delete data[key];
    }
    var has = function(key) {
      if (data[key]) {
        return true;
      } else {
        return false;
      }
    }
    var clear = function() {
      data = {};
    }
    var Length = function() {
      return Object.keys(data).length;
    }
    if (!Protected) {
      var all = function() {
        var d = data;
        return d;
      }
    }
    if (Protected) {
      return {
        set: set,
        get: get,
        remove: remove,
        has: has,
        Length: Length,
        clear: clear
      }
    } else {
      return {
        set: set,
        get: get,
        remove: remove,
        has: has,
        Length: Length,
        all: all,
        clear: clear
      }
    }
  })();
  //Load properties into the object being constructed
  for (var prop in tempObj) {
    this[prop] = tempObj[prop];
  }
}

function dataGroup(name, KVPS) {
  this.dataSystem = KVPS;
  this.name = name;
  if (this.dataSystem.get(name)==null) {
    var setup = new Array();
    this.dataSystem.set(name,JSON.stringify(setup));
  }
  this.debug = false;
  //Add an element and assign a value (which must be an object)
  this.add = function(value) {
    var rows = JSON.parse(this.dataSystem.get(this.name));
    rows.push(value);
    this.dataSystem.set(this.name, JSON.stringify(rows));
    if(this.debug===true){console.log(this.name+" -> add: Object successfully added!");}
  };
  //Change a specific property of an element where a property equals a certain value: where BY equals "user4" set TITLE to "hello there"
  this.edit = function(whereThis,equalsThis,setThis,ToThis) {
    var rows = JSON.parse(this.dataSystem.get(this.name));
    if (rows.length>0){
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row[whereThis]==equalsThis) {
          if(this.debug===true){console.log(this.name+" -> edit: Object before - ");console.log(row);}
          row[setThis]=ToThis;
          if(this.debug===true){console.log(this.name+" -> edit: Object after - ");console.log(row);}
          rows[i] = row;
          if(this.debug===true){console.log(this.name+" -> edit: Object saved!");}
        }
      }
      this.dataSystem.set(this.name, JSON.stringify(rows));
    } else {
      if(this.debug===true){console.log(this.name+" -> edit: No objects are stored!");}
    }
  };

  //Remove an element where a specific property equals a certian value
  this.remove = function(whereThis,equalsThis) {
    var rows = JSON.parse(this.dataSystem.get(this.name));
    if (rows.length>0){
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
          if (row[whereThis]==equalsThis) {
            if(this.debug===true){console.log(this.name+" -> remove: Object matched for removal -");console.log(row);}
            rows.splice(i,1);
            if(this.debug===true){console.log(this.name+" -> remove: Object deleted!");}
          }
      }
      this.dataSystem.set(this.name, JSON.stringify(rows));
    } else {
      if(this.debug===true){console.log(this.name+" -> remove: No objects are stored!");}
    }
  };

  //Return an element as an object where a property equals a value
  this.get = function(whereThis,equalsThis) {
    var rows = JSON.parse(this.dataSystem.get(this.name));
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row[whereThis]==equalsThis) {
        if(this.debug===true){console.log(this.name+" -> get: Object found! ");console.log(row);}
        return row;
      }
    }
    if(this.debug===true){console.log(this.name+" -> get: Object not found!");}
    if (rows.length<1&&this.debug===true){
      console.log(this.name+" -> get: No objects, with the property of "+whereThis+", matched "+equalsThis);
    }
    return null;
  };

  //Return an array of all the elements as objects
  this.listAll = function() {
    var rows = JSON.parse(this.dataSystem.get(this.name));
    if (rows.length<1&&this.debug===true) {
      console.log(this.name+" -> listAll: There are no stored objects to return!");
    }
    if(this.debug===true){console.log(this.name+" -> listAll: Objects were found!");console.log(rows);}
    return rows;
  };

  //Clear all data
  this.clear = function() {
    this.dataSystem.clear();
  }

  //Return an array of elements as objects that all have a specific property that is equal to a certain value
  this.where = function(whereThis,equalsThis) {
    var result = new Array();
    var rows = JSON.parse(this.dataSystem.get(this.name));
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row[whereThis]==equalsThis) {
        if(this.debug===true){console.log(this.name+" -> search: Object matched - ");console.log(row);}
        result.push(row);
      }
    }
    if (result.length<1&&this.debug===true) {
      console.log(this.name+" -> search: No objects, with the property of "+whereThis+", matched "+equalsThis);
    }
    if(this.debug===true){console.log(this.name+" -> search: Final result - ");console.log(result);}
    return result;
  };
  this.filter = function(evaluations) {
    var data = JSON.parse(this.dataSystem.get(this.name)),
        result = new Array(), check = null;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            for (var x = 0; x < evaluations.length; x++) {
            if (eval(evaluations[x].split("object").join("row"))) {
                check = true;
                if (this.debug) {
                    console.log("Passed: "+evaluations[x].split("object").join("row"))
                }
                continue;
            } else {
                check = false;
                if (this.debug) {
                    console.log("Failed: "+evaluations[x].split("object").join("row"))
                }
                break;
            }
            }
            if (check==true) {
            result.push(row);
            }
        }
        if (result.length < 1) {
            return false;
        }
        return result;
  };
  this.debugFunction = function(func,parameters,oops,catchAs) {
      if(oops!==undefined&&catchAs!==undefined){
        try{
          this[func](parameters);
        }
        catch(catchAs){
            oops();
        }
      } else{
        try{
            this[func](parameters);
        }
        catch(err){
            console.log(err);
        }
      }
  }
}

function QuOOS(name, KVPS) {
  if (!name) {
    var name = (Math.floor(Math.random()*1000000)).toString();
  }
  if (KVPS) {
    this.KVPS = new KVP_System();
    cloneObject(new dataGroup(name, this.KVPS), this)
  } else {
    cloneObject(new dataGroup(name, new KVP_System()), this);
  }
}
