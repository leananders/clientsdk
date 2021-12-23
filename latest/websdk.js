// The client side of the LeanSDK for Web applications.  Not used by RN.
'use strict';

// Assumption: the HTML file referenced by the client through an
// IFRAME has the same base name as the JS library.
let webSdkScriptUrl = document.currentScript.getAttribute('src');

let Lean;
window.addEventListener('load', () => {
//  console.log('init');
  Lean = new LeanSDK();
});

// One time initialization performed by the client after document load
function LeanSDK() {

  // Create the IFRAME and put it inside of the client
  document.getElementById('lean-link').outerHTML = "<iframe id='lean-link' style=\
'position:absolute;top:0;width:100%;height:100%;border-width:0;display:none;z-index:100;' \
src='" + webSdkScriptUrl.substring(0, webSdkScriptUrl.length - 2) + "html'></iframe>";

  window.addEventListener("message", (event) => {
//    console.log('ret main cb: ' + this.callback);
    let jsonObject = event.data;
    if (jsonObject.lean$r) {
//      console.log('ret main: ' + JSON.stringify(jsonObject.lean$r));
      event.stopImmediatePropagation();
      if (this.callback) {
        this.callback(jsonObject.lean$r);
      }
      this.closeUI();
    }
  });

  // CSS for keeping IFRAME filling the window
  this.setFrameHeight = function() {
    let e = document.getElementById('lean-link');
    e.style.height = window.innerHeight + 'px';
    return e;
  };

  // Resized window
  window.addEventListener('resize', () => {
    this.setFrameHeight();
  });

  // Core API method.  Dispatches to the IFRAME code.
  // Since JS calls between IFRAMEs do not work we must
  // save the callback function in the API and continue
  // without it.
  this.apiCall = function(method, javaScriptObject) {
    this.callback = javaScriptObject.callback;
    javaScriptObject.callback = undefined;
    let e = this.setFrameHeight();
    e.style.display = 'flex';
    e.contentWindow.postMessage({lean$m: method, argument: javaScriptObject}, '*');
  };
}

// The public API
LeanSDK.prototype.link = function(jsonData) {
  this.apiCall('link', jsonData);
};

LeanSDK.prototype.connect = function(jsonData) {
  this.apiCall('connect', jsonData);
};

LeanSDK.prototype.reconnect = function(jsonData) {
  this.apiCall('reconnect', jsonData);
};

LeanSDK.prototype.updatePaymentSource = function(jsonData) {
  this.apiCall('updatePaymentSource', jsonData);
};

LeanSDK.prototype.createPaymentSource = function(jsonData) {
  this.apiCall('createPaymentSource', jsonData);
};

LeanSDK.prototype.pay = function(jsonData) {
  this.apiCall('pay', jsonData);
};

LeanSDK.prototype.closeUI = function() {
  document.getElementById('lean-link').style.display = 'none';
};
