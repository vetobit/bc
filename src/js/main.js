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
        dom = screen.querySelectorAll("[data-request]"),
        request = [];
    for(var item in dom){
      item=dom[item];
      if(typeof(item)=="object"){
        if(item.tagName=="TABLE"){
          var ths=item.querySelectorAll("th"),
              item=item.querySelector("tbody"),
              thsRequest=[];
          for(var th in ths){
            var thItem=ths[th];
            if(typeof(thItem)=="object"){
              thsRequest.push(obj.whatdo(thItem.getAttribute("data-request")));
            }
          }
          console.log(thsRequest);
        }
        request.push(obj.whatdo(item.getAttribute("data-request")));
      }
    }
  },
  whatdo:function(request){
    var request=JSON.parse(request);
    request.parent=eval(request.parent);
    return request;
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
      }
    }else{
      obj.run=1;
    }
  }
};