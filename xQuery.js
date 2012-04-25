/**
* return HTMLElement(s)
* 
* @param name Element name
* 
* @returns {object or boolean}
*/
var $ = function(name, parent){
    if(String.isNullOrEmpty(name)) return false;  
    var _elem,
        _name = name,
        _parent = parent || document;
   // alert(_parent.toString()+"\n"+typeof _parent);

    if(name[0]=='.' || name[0]=='#' || name[0]==' ') 
        _name = name.substr(1);
    
    var _tmp=_name.search(/[\.\#\[\ ]/);
    if(_tmp!=-1) _name = _name.substr(0, _tmp);
        
    if(name[0]=='.') {
        _elem = _parent.getElementsByClassName(_name);
    } else if(name[0]=='#')
        _elem = _parent.getElementById(_name);
    else {
            if(parent instanceof HTMLSelectElement && _name=="option") throw Error("Use \"$(HTMLSelectElement[id|className|attribute]).options[index]\" instead");
        _elem = _parent.getElementsByTagName(_name); 
    }
    
    if(_elem.length==0) throw TypeError("Element is null or doesn't exists"); 
    if(typeof _elem != "object" || _tmp==-1) return _elem.length==1 ? _elem[0]:_elem; 
    
    var _newElem = name.substr(_tmp+1); 
    // alert(_newElem+"\n["+name[_tmp]+"]");
    switch(name[_tmp]) { 
        case "#":
            if(_elem.length==1) return _elem.id==_newElem ? _elem[0] : []; 
            
            for(var item in _elem)
                if(!isNaN(item) && _elem[item].id==_newElem)     
                    return _elem[item];
        case ".":
            if(_elem.length==1) return _elem.className==_newElem ? _elem[0] : []; 
            
            var arr=new Array();             
            for(var item in _elem)
                if(!isNaN(item) && _elem[item].className==_newElem)
                    arr.push(_elem[item]);
            return arr.length==1?arr[0]:arr; 
     case "[":
            _newElem = _newElem.substr(0, _newElem.length-1).split("=");
            if(_elem.length==1) return _elem[0].getAttribute(_newElem[0])==_newElem[1] ? _elem[0] : []; 
            
            var arr=new Array();             
            for(var item in _elem)
                if(!isNaN(item) && _elem[item].getAttribute(_newElem[0])==_newElem[1])
                    arr.push(_elem[item]); 
            return arr.length==1?arr[0]:arr; 
     case " ": 
        return (String.isNullOrEmpty(_newElem))? (_elem.length==1 ? _elem[0] : _elem) : $(_newElem, _elem.length==1 ? _elem[0] : _elem); 
    }
}

$.forms = function(value) {
    if(document.forms[value])
        return document.forms[value];
    return false;
}

$.ajax = function (method, url, callback, parameters, headers) {
    if(String.isNullOrEmpty(url)) return false;
    if(String.isNullOrEmpty(method)) method = "GET";
    parameters = parameters || null;
                                                                       
    var xmlhttp;
    if (window.ActiveXObject) { 
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP")
        } 
        catch (e){
            try{
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
            }
            catch (e){}
        }
    } else if (window.XMLHttpRequest)                           
        xmlhttp=new XMLHttpRequest();  
    if(!xmlhttp) return false;
    
    if(!String.isNullOrEmpty(callback))                         
        xmlhttp.onreadystatechange=function() {
             if (xmlhttp.readyState==2 && parseInt(xmlhttp.status/100)!=2) { 
                 alert("State: "+xmlhttp.readyState+"\nStatus: "+parseInt(xmlhttp.status/100));
                 xmlhttp.abort();
             }
            if (xmlhttp.readyState==4 && xmlhttp.status==200) { 
                if(typeof callback == "string")  
                {
                    alert(escape(xmlhttp.responseText));
                    setTimeout(callback+"(\""+escape(xmlhttp.responseText)+"\")", 0);
                } else if(typeof callback == "function")
                   callback.call(callback, escape(xmlhttp.responseText))     
                   //eval("var _xQuery_ajax_onreadystatechange="+callback+";_xQuery_ajax_onreadystatechange("+xmlhttp.responseText+");");
            }
        }  
                
    xmlhttp.open(method,url,true);                                           
    xmlhttp.send(parameters);
    return true;
}
$.newElement = function(tagname, properties) {
        if(String.isNullOrEmpty(tagname)) return false;
        var _tEl = document.createElement(tagname);
        
        if(properties==undefined || properties.length==0)
            return _tEl;
        
        if(typeof properties =="string") {
            var _pro = properties.split("="); 
            if(_pro.length==2) _tEl.setAttribute(_pro[0], _pro[1]);
        } 
        else if(typeof properties =="object") {
            for(var _pro in properties)
                _tEl.setAttribute(_pro, properties[_pro]);
        }
        return _tEl;  
};
    
$.html5 = function(){};

$.html5.loadFile = function(fileInput, onload, onprogress)
{
    if(String.isNullOrEmpty(fileInput)) return false;
    
    var _file;
    if(fileInput instanceof File)
        _file = fileInput;
    else {
        var _el;    
        if(typeof fileInput == "string") 
           _el = $(fileInput);
        else if(fileInput instanceof HTMLInputElement)
           _el = fileInput;
           
        if(!_el.files.length) return false;
        _file = _el.files[0];
    }
    var file = new FileReader();
    if(onload) file.onload=function(e) {
        if(typeof onload=="function")
            setTimeout("var _xQuery_loadFile_onload="+onload+";_xQuery_loadFile_onload(\""+e.target.result+"\");", 0);
        else if(typeof onload=="string")
            setTimeOut(onload+"(\""+e.target.result+"\");", 0);
    }
    if(onprogress) file.onprogress=function(e) {
        if(typeof onprogress=="function")
            eval("var _xQuery_loadFile_onprogress="+onprogress+";_xQuery_loadFile_onprogress(e.target.result);");
        else if(typeof onprogress=="string")
            eval(onprogress+"(\"e.target.result\");");
    }
    file.readAsDataURL(_file);
    return true;
}                 
  
$.ajax.uploadFile = function(fileInput) {
    
}
                        
var xQuery = {    
                            
    temp : null,  
    loadFile : function(fileInput, onComplete)
    {
        if(!fileInput) return false;
        if ( window.FileReader ) {
            reader = new FileReader();
            if(onComplete)
                reader.onloadend = function (e) {
                
                //if(typeof onComplete == "string")
                    if($("#file").type.match("/image.*/"))
                        var img = $.create("img")
                        li.innerHTML += e.target.name;   
                };
            reader.readAsDataURL($("#file").files[0]);
        }
    },
    
    bytesConverter: function(size)
    {
       if(typeof size!="number" || isNaN(size)) throw TypeError("Not a Number");
       else {
           var sizeName = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
           with(Math){
               var _point,
                   _i = ceil((String(size).length/3)-1),
                   _size=String(size*pow(1024, _i)/pow(1024, _i*2));
               if((_point=_size.indexOf("."))!=-1)
                 _size=parseFloat(_size.substr(0, _point+3));
               return _size+" "+sizeName[_i];
           }
        }          
    }
};                         

HTMLInputElement.prototype.isValidAccept=function() {
    if(this.type!="file") throw TypeError("Valid only for elements 'input' with attribute 'type=file' #<input type=\"file\">");
    else if(!this.hasAttribute("accept")) throw Error("Accept attribute is needed #<input type=\"file\" accept=\"mp3|mp4a|wma|ogg|acc\">");
    else {
        if(this.getAttribute("accept").indexOf("/")!=-1) { //mimetype
            for(var file=0; file<this.files.length; file++)
                if(!this.files[file].type.match("/["+this.getAttribute("accept")+"]+/i"))
                    return false;
            return true;
        } else { //extension
            for(var file=0; file<this.files.length; file++)
                if(!this.files[file].name.match("/\\.["+this.getAttribute("accept")+"]+$/i"))
                    return false;
            return true;
        }
    }
}
/**
* return boolean or object
* 
* @param name Element name
* @param value Element value to be setted
* 
* @returns {boolean or string}
*/
HTMLTextAreaElement.prototype.attribute = _xQuery_prototype_attribute_function;
HTMLInputElement.prototype.attribute = _xQuery_prototype_attribute_function;

function _xQuery_prototype_attribute_function(attributeName, attributeValue) {
    if(!isDefined(attributeName) || String.isNullOrEmpty(attributeName)) return false; 
    
    if(!isDefined(attributeValue)) return !this.attributes[attributeName]?"":this.attributes[attributeName].value;
    if(String.isNullOrEmpty(attributeValue)) this.removeAttribute(attributeName);
    else this.setAttribute(attributeName, attributeValue);
    return true;
}
HTMLInputElement.prototype.click = function(callFunction) {
    if(!this) return false;
    
    this.onclick = callFunction;
    
    return true;
}
HTMLInputElement.prototype.setError = function(msg, color) {
    if(this) {
        this.value=String.empty;
        this.style.backgroundColor = isDefined(color)?color:"#ffffdd";
        this.focus();
        
        if(!String.isNullOrEmpty(msg))
            alert(msg);   
    }
}

String.empty = "";
String.isNullOrEmpty = function(value) {
     return ((typeof value!="undefined" && value==null) || value=="");   
}
String.prototype.toInt=function(radix) {
    if(typeof radix=="number")
        return parseInt(this, radix);
    else
        return parseInt(this);
}
String.prototype.toFloat=function() {
        return parseFloat(this);
}
String.prototype.replaceAll=function(searchValue, replaceValue){    
    if(!this.isNullOrEmpty()) {
        var text = this;
        while(text.indexOf(searchValue)!=-1)
            text=text.replace(searchValue, replaceValue);
        return text;
    }
}
String.prototype.removeNoNumeric=function(){    
    if(!String.isNullOrEmpty(this)) {
        var text = this;
        for(var i=0;i<text.length;i++)
            if(isNaN(text[i]))
                text=text.replace(text[i], "");
        return text;
    }
}

Number.prototype.range = function(minValue, maxValue) {
    if(isNaN(minValue) || isNaN(maxValue) || minValue>=maxValue) return false;
    return (this>=minValue && this<=maxValue);
}

Number.prototype.round=function(precision){
    if(isNaN(precision)) throw TypeError("precision must be an integer")
    else{
      var _point,
          _numbRounded,
          _precision = parseInt(precision),
          _numbString=String(this);
          
          if((_point=_numbString.indexOf("."))!=-1 && _numbString.length>_point+1+_precision){
            _numbRounded=_numbString.substr(0, _point+_precision);
            
            if(_numbString[_point+_precision+1]>4) 
                if(_numbString[_point+_precision]==".") 
                    _numbRounded+=String(_numbString[_point+_precision-1].toInt()+1);
                else
                    _numbRounded+=String(_numbString[_point+_precision].toInt()+1);
            else 
                _numbRounded+=_numbString[_point+_precision];
          }
          return _numbRounded.toFloat();
    }
}

function isDefined(value) {
   return typeof value!="undefined"; 
}

var Events = {click:"click", change:"change", blur:"blur", focus:"focus", mouseover:"mouseover", mouseout:"mouseout", load:"load", unload:"unload"};
var _Events = ["click", "blur", "load", "unload"];

