window.addEventListener("DOMContentLoaded",function(){
  window.location.hash="login";
  obj.getUsers(true);
  obj.getOutin(true);
});
var obj={
  user:{

  },
  init:function(authorization){
    if(authorization){
      if(obj.user.type!="people"){
        obj.getNeeds(true);
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
    if(request.type!="get" && request.type!="add" && request.type!="rewrite"){
      request.type=request.type.split(":")[1];
      var linkObject = eval(request.link[0]);
      var linkParam = linkObject.querySelectorAll("[data-info="+request.type+"]")[0].value;
      request.type=linkParam;
      if(request.parent=="obj.users"){
        var dopParent=linkObject.querySelectorAll("[data-info=company]")[0].value;
        if(dopParent=="bc"){
          request.parent+=".bc";
          var localNumber = "0";
        }
        else{
          request.parent+=".other";
          var localNumber = "1";
        }
      }
    }
    if(request.obj=="link:number"){
        var linkObject = eval(request.link[0]);
        request.obj=linkObject.querySelectorAll("[data-info="+request.obj.split(":")[1]+"]")[0].innerHTML;
    } 
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
        var copyParentText=request.parent;
        request.parent=eval(request.parent);
        if(localNumber){
          object.number=localNumber+"."+request.parent.length;  
        }
        else{
          object.number=request.parent.length;
        }
        request.parent.push(object);
        // obj.uploadScreen(obj.user.type);
        window.location.hash=obj.user.type;
        obj.uploadScreen(obj.user.type);
        console.log(copyParentText);
        if(copyParentText=="obj.needs"){
            obj.rewriteFile(obj.needs,"json/need.json");
        }
        else{ 
          if(copyParentText=="obj.users.bc"){
            obj.rewriteFile(obj.users,"json/users.json");
          }
          if(copyParentText=="obj.users.other"){
            obj.rewriteFile(obj.users,"json/users.json");
          }
        }
      }
      else{
        if(request.type=="rewrite"){
          var dom = document.querySelector(window.location.hash),
              domParams = dom.querySelectorAll("[data-info]"),
              object = {};
          for(domParam in domParams){
            domParam = domParams[domParam];
            if(typeof(domParam)=="object"){
              if(domParam.tagName!="SELECT" && domParam.tagName!="INPUT"){
                if(domParam.getAttribute("data-value")){
                  object[domParam.getAttribute("data-info")]=domParam.getAttribute("data-value");
                }
                else{
                  object[domParam.getAttribute("data-info")]=domParam.innerHTML;
                }
                
              }
              else{
                object[domParam.getAttribute("data-info")]=domParam.value;
              }
            }
          }
          var copyParentText=request.parent;
          if(request.parent=="obj.needs"){
            request.parent=eval(request.parent);
            delete(object.do);    
            for(var item in request.parent[request.obj]){
              itemObj=request.parent[request.obj][item];
              for(objectItem in object){
                if(item == objectItem){
                  request.parent[request.obj][item]=object[objectItem];
                }
              }
            }
          }
          else{
            request.parent=eval(request.parent);
            delete(object.do);
            request.parent[request.obj.split(".")[1]]=object;  
          }
          if(copyParentText=="obj.needs"){
            obj.rewriteFile(obj.needs,"json/need.json");
          }
          else{ 
            if(copyParentText=="obj.users.bc"){
              obj.rewriteFile(obj.users,"json/users.json");
            }
            if(copyParentText=="obj.users.other"){
              obj.rewriteFile(obj.users,"json/users.json");
            }
          }
          window.location.hash=obj.user.type;
          obj.uploadScreen(obj.user.type);
        }
        else{
          if(request.type=="delete"){
            var parent=eval(request.parent);
            //delete(parent[request.obj.split(".")[1]]);
            for(var parentKey in parent){
              var parentItem = parent[parentKey];
              for(parentItemKey in parentItem){
                parentItemItem = parentItem[parentItemKey];
                if(parentItemItem == request.obj){
                  parent.splice(parentKey,parentKey);
                }
              }
            }
            //console.log(parent);
            window.location.hash=obj.user.type;
            obj.uploadScreen(obj.user.type);
            if(request.parent=="obj.needs"){
              obj.rewriteFile(obj.needs,"json/need.json");
            }
            else{
              if(request.parent=="obj.users.bc"){
                obj.rewriteFile(obj.users,"json/users.json");
              }
              if(request.parent=="obj.users.other"){
                obj.rewriteFile(obj.users,"json/users.json");
              }
            }
          }
        }
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
  rewriteFile:function(obj,url){
    var fs = require('fs');
    fs.writeFileSync(url,JSON.stringify(obj),'utf8');
  },
  getUsers:function(responseText){                                                    
    if(responseText!=true){                                                          
      if(responseText!=false){
        obj.users=JSON.parse(responseText);
        obj.checkFiles();
        obj.uploadScreen("login");                                             
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
  },
  addToOutin:function(item){
    var object=item.getAttribute("data-object"),
        param = item.getAttribute("data-param"),
        doing = item.getAttribute("data-doing");
        newObj={};
    for(var user in obj.users[object]){
      user=obj.users[object][user];
      if(user.name==param){
        newObj.user=param;
        newObj.company=user.company;
        newObj.date=new Date();
        newObj.doing=doing;
        obj.outin.push(newObj);
        obj.rewriteFile(obj.outin,"json/outin.json");
        return 0;
      }
    }
  }
};