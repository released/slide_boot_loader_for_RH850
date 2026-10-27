// Generated from guide-map.json; routes stay within this guide.
(function(){
  "use strict";
  var routes=Object.assign(Object.create(null),{"rh850-can-device":{"page":"can-device.html","anchor":"rh850-can-device"},"rh850-evm-can-ports":{"page":"can-device.html","anchor":"rh850-evm-can-ports"},"rh850-can-service":{"page":"can-device.html","anchor":"rh850-can-service"},"rh850-update-port-owner":{"page":"can-device.html","anchor":"rh850-update-port-owner"},"rh850-app-editing":{"page":"app-development.html","anchor":"rh850-app-editing"},"rh850-irq-entry":{"page":"app-development.html","anchor":"rh850-irq-entry"},"rh850-build-products":{"page":"app-development.html","anchor":"rh850-build-products"},"rh850-update-timing":{"page":"app-development.html","anchor":"rh850-update-timing"},"rh850-serial-runtime":{"page":"serial-device.html","anchor":"rh850-serial-runtime"},"rh850-serial-sc-roundtrip":{"page":"serial-device.html","anchor":"rh850-serial-sc-roundtrip"},"rh850-flash-layout":{"page":"porting.html","anchor":"rh850-flash-layout"},"rh850-project-entry":{"page":"porting.html","anchor":"rh850-project-entry"},"rh850-flash-ram":{"page":"porting.html","anchor":"rh850-flash-ram"},"rh850-startup-handoff":{"page":"porting.html","anchor":"rh850-startup-handoff"},"rh850-image-reference":{"page":"reference.html","anchor":"rh850-image-reference"},"rh850-metadata-bytes":{"page":"reference.html","anchor":"rh850-metadata-bytes"},"rh850-can-frames":{"page":"reference.html","anchor":"rh850-can-frames"},"rh850-can-page-flow":{"page":"reference.html","anchor":"rh850-can-page-flow"}});
  function destination(item){
    var target=new URL(item.page,location.href);
    if(target.origin!==location.origin)return null;
    target.search=location.search;target.hash=item.anchor;return target;
  }
  function route(){
    var hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch(e){return;}
    if(document.getElementById(hash))return;
    var item=routes[hash];if(!item)return;
    var target=destination(item);if(!target)return;
    if(target.pathname!==location.pathname||target.hash!==location.hash)location.replace(target.href);
  }
  addEventListener("guide:ready",function(){
    document.querySelectorAll('#content a[href^="#"]').forEach(function(link){
      var id;try{id=decodeURIComponent(link.hash.slice(1));}catch(e){return;}
      if(document.getElementById(id)||!routes[id])return;
      var target=destination(routes[id]);if(target)link.href=target.href;
    });route();
  });
  addEventListener("hashchange",route);
  if(!document.body.hasAttribute("data-markdown"))route();
}());
