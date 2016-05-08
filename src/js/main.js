window.addEventListener("DOMContentLoaded",function(){
  window.location.hash="login";
});
var obj={
  user:{

  },
  init:function(authorization){
    if(authorization){
      if(obj.user.type!="people"){
        obj.getUsers(true);
        obj.getNeeds(true);
        obj.getOutin(true);
        console.log("dqwdqwqwd");
      }else{
        console.log("Прошёл через турникет");   
      }
    }
    else{
      console.log("не авторизован");
    }
  },
  uploadScreen:function(hash){
    var screen = document.querySelector("#"+hash),
    dom = screen.querySelectorAll("[data-request]");
    for(var item in dom){
      item=dom[item];
      if(typeof(item)=="object"){
        if(item.tagName=="TABLE"){
          item.querySelector("tbody").innerHTML="";
          var ths=item.querySelectorAll("th"),
          thsRequest=[];
          for(var th in ths){
            var thItem=ths[th];
            if(typeof(thItem)=="object"){
              thsRequest.push(thItem.getAttribute("data-request"));
            }
          }
          if(!(obj[item.getAttribute("data-mainObj")] instanceof Array)){
            for(object in obj[item.getAttribute("data-mainObj")]){
              objectItem=obj[item.getAttribute("data-mainObj")][object];
              for(deep in objectItem){
                deepObj=objectItem[deep];
                var tr = document.createElement("tr"),
                trRequest = item.getAttribute("data-request");
                tr.setAttribute('onclick','obj.popup=JSON.parse(\''+JSON.stringify(deepObj)+'\'); obj.uploadScreen(\"'+item.getAttribute("data-popup")+'\"); window.location.hash=\"'+item.getAttribute("data-popup")+'\";');
                for(var num in thsRequest){
                  var td=document.createElement("td"),
                  deepKeys=Object.keys(deepObj),
                  thRequest=JSON.parse(thsRequest[num]);
                  thRequest.parent="obj."+item.getAttribute("data-mainObj")+"."+object;
                  thRequest.obj=deep;
                  td.innerHTML=obj.whatdo(JSON.stringify(thRequest));
                  tr.appendChild(td);
                }
                item.querySelector("tbody").appendChild(tr);
              }
            }
          }
          else{
            console.log(item.getAttribute("data-mainObj"));
            obj[item.getAttribute("data-mainObj")].map(function(object){
              var tr=document.createElement("tr");
              tr.setAttribute('onclick','obj.popup=JSON.parse(\''+JSON.stringify(object)+'\'); obj.uploadScreen(\"'+item.getAttribute("data-popup")+'\"); window.location.hash=\"'+item.getAttribute("data-popup")+'\";');
              for(var num in thsRequest){
                var td=document.createElement("td"),
                objectKeys=Object.keys(object),
                thRequest=JSON.parse(thsRequest[num]); 
                thRequest.obj=item.querySelector("tbody").childElementCount; 
                td.innerHTML=obj.whatdo(JSON.stringify(thRequest));
                tr.appendChild(td);
              }
              item.querySelector("tbody").appendChild(tr);
            });
          }
        }
        else{
          if(item.tagName!="TH"){
            if(item.tagName!="SELECT" && item.tagName!="INPUT"){
              item.innerHTML=obj.whatdo(item.getAttribute("data-request"));
            }
            else{
              if(item.tagName!="INPUT"){
                item.innerHTML="";
                var request = JSON.parse(item.getAttribute("data-request"));
                request.parent=eval(request.parent);
                request.param=eval(request.param);
                for(var param in request.parent[request.obj]){
                  param=request.parent[request.obj][param];
                  var option = document.createElement("option");
                  option.innerHTML=option.value=param[request.param];
                  item.appendChild(option);
                }
              }
              else{
                item.value=obj.whatdo(JSON.stringify(JSON.parse(item.getAttribute("data-request"))));
              }
            }
          }
        }
      }
    }
  },
  whatdo:function(request){
    request=JSON.parse(request); 
    if(request.type=="get"){    
      request.parent=eval(request.parent);
      return request.parent[request.obj][request.param[0]];
    }
    else{
      if(request.type=="add"){
        var screen = document.querySelector(window.location.hash),
        newObject = {links:[]};
        for(var link in request.link){
          link=request.link[link]=eval(request.link[link]);
          if(link.tagName){
            var elements=link.querySelectorAll("[data-info]"),
            values=[],
            object={};
            if(link.getAttribute("data-info")){
              values.push(link.getAttribute("data-info"));
              if(!link.value){
                if(!link.getAttribute("data-value")){
                  if(!link.innerHTML){
                    object[values[values.length-1]]="Не нашёлся параметр";
                  }
                  else{
                    object[values[values.length-1]]=link.innerHTML;
                  }
                }
                else{
                  object[values[values.length-1]]=link.getAttribute("data-value");
                }
              }
              else{
                object[values[values.length-1]]=link.value;
              }
            }
            if(elements){
              for(element in elements){
                if(typeof(elements[element])=="object"){
                  values.push(elements[element].getAttribute("data-info"));
                  element=elements[element];

                  if(!element.value){
                    if(!element.getAttribute("data-value")){
                      if(!element.innerHTML){
                        object[values[values.length-1]]="Не нашёлся параметр";
                      }
                      else{
                        object[values[values.length-1]]=element.innerHTML;
                      }
                    }
                    else{
                      object[values[values.length-1]]=element.getAttribute("data-value");
                    }
                  }
                  else{
                    object[values[values.length-1]]=element.value;
                  }
                }
              }
            }
          }
          else{
            if(request.param.length!=values.length){
              var newParam=request.param;
              values.map(function(localMap){
                newParam=newParam.join("").split(localMap);
              });
              newParam.map(function(param){
                if(param!=""){
                  object[param]=link[param];
                }
              });
            }
          }
        }
        request.parent=eval(request.parent);
        object.number=request.parent.length;
        request.parent.push(object);
        obj.uploadScreen(obj.user.type);
      }
      else{
        return request;
      }
    }
  },
  authorization:function(responseText){                                            
    if(responseText!=false){                                                          
      var users = JSON.parse(responseText),                                           
          flag = false;
      users.bc.map(function(user){                                                       
        if(user.login == obj.user.login && user.password == obj.user.password){       
          obj.user = user;                                                            
          flag = true;                                                                
        }
      });
      if(flag){                                                                       
        obj.init(true);                                                               
      }else{                                                                          
        users.other.map(function(user){                                                       
          if(user.login == obj.user.login && user.password == obj.user.password){       
            obj.user = user;                                                            
            flag = true;                                                                
          }
        });
        if(flag){
          obj.init(true);
        }
        else{
          obj.init(false);
        }                                                              
      }
    }
    else{                                                                             
      obj.getFile("json/users.json",function(string){                                 
        obj.authorization(string);                                                    
      });
    }
  },
  getFile:function(url,func){                                                         
    var xhr=new XMLHttpRequest();                                                     
    xhr.open("GET", url, true);                                                       
    xhr.onreadystatechange=function(){                                                
      if(xhr.status==200 && xhr.readyState ==4){                                       
        func(xhr.responseText);                                                      
      }                                                     
    };
    xhr.send(null);                                                                   
  },
  getUsers:function(responseText){                                                    
    if(responseText!=true){                                                          
      if(responseText!=false){
        obj.users=JSON.parse(responseText);
        obj.checkFiles();                                             
      }else{
        obj.users={};
        obj.checkFiles();
      }
    }                                                                                 
    else{                                                                            
      obj.getFile("json/users.json",function(string){                              
        obj.getUsers(string);                                                          
      });
    }
  },
  getOutin:function(responseText){                                                    
    if(responseText!=true){                                                          
      if(responseText!=false){
        obj.outin=JSON.parse(responseText);
        obj.checkFiles();                                              
      }else{
        obj.outin=[];
        obj.checkFiles();
      }
    }                                                                                 
    else{                                                                            
      obj.getFile("json/outin.json",function(string){                              
        obj.getOutin(string);                                                          
      });
    }
  },
  getNeeds:function(responseText){                                                    
    if(responseText!=true){                                                          
      if(responseText!=false){
        obj.needs=JSON.parse(responseText); 
        obj.checkFiles();                                             
      }else{
        obj.needs=[];
        obj.checkFiles();
      }
    }                                                                                 
    else{                                                                            
      obj.getFile("json/need.json",function(string){                              
        obj.getNeeds(string);                                                          
      });
    }
  },
  checkFiles:function(){
    if(obj.run){
      obj.run++;
      if(obj.run==3){
        obj.uploadScreen(obj.user.type);
        window.location.hash=obj.user.type;
        obj.run=0;
      }
    }else{
      obj.run=1;
    }
  }
};