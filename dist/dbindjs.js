/* dbindjs - data binding for Javascript
dbindjs is Copyright (C) 2017-2023 Nicolae Iotu, nicolae.g.iotu@gmail.com
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>. */
"use strict";const isBrowser=new Function("try {return this===window;}catch(e){return false;}")(),hasOwnProperty=Object.prototype.hasOwnProperty,dbind=function(){let bindHolder,bindingPoolDescriptor,typeCarrier;const argsLen=arguments.length,args0=arguments[0];if(0===argsLen)throw new TypeError("Expecting at least an argument.");if(1===argsLen){if("object"!=typeof args0||null===args0)throw new TypeError("Expecting at least an argument.");bindHolder=isBrowser&&this===window?dbind:this||dbind,bindingPoolDescriptor=args0,typeCarrier=dbind.prototype}else if(argsLen>=2){const args1=arguments[1];if("object"!=typeof args0||null===args0)throw new TypeError("First argument must be an object.");if("object"!=typeof args1||null===args1)throw new TypeError("The second argument must be an object.");if(!Object.isExtensible(args0)||Object.isFrozen(args0)||Object.isSealed(args0))throw new TypeError("Make sure the target object is extensible, not frozen and not sealed.");bindHolder=args0,bindingPoolDescriptor=args1,typeCarrier=dbind.prototype}const props=Object.keys(bindingPoolDescriptor),propsLen=props.length;if(0===propsLen)throw new TypeError("Binding descriptor object is empty, or properties are not enumerable.");{let propName,propValue,hasFunction=!1,i=0;for(;i<props.length;)hasFunction?(propName=props[i],propValue=bindingPoolDescriptor[propName],hasOwnProperty.call(bindHolder,"propstore")&&hasOwnProperty.call(bindHolder,"settings")||typeCarrier.defaultRuntime(bindHolder),"function"==typeof propValue?typeCarrier.addData(bindHolder,propName,propValue,props):(typeCarrier.addData(bindHolder,propName,propValue),typeCarrier.addData(bindHolder,propName,propValue)),i++):"function"==typeof bindingPoolDescriptor[props[i]]?(hasFunction=!0,i=0):i++;if(!hasFunction){for(i=0;i<propsLen;i++){if(propName=props[i],!hasOwnProperty.call(bindHolder.bindstore,propName))return;bindHolder.bindstore[propName]=bindingPoolDescriptor[propName]}if(bindHolder.settings.pause)return;bindHolder.settings.mergeUpdates&&typeCarrier.runUpdateQueue(bindHolder)}}};dbind.prototype=Object.create(Object.prototype),dbind.prototype.constructor=dbind,function(){Object.defineProperty(this,"explicitDefaults",{configurable:!1,enumerable:!1,get:function(){return function(obj){return{value:obj,configurable:!1,enumerable:!1,writable:!1}}}}),Object.defineProperty(this,"explicitNonConfigurable",{configurable:!1,enumerable:!1,get:function(){return function(obj){return{value:obj,configurable:!1,enumerable:!0,writable:!0}}}}),Object.defineProperties(this,{storeMemberKeys:this.explicitDefaults(["dependencies","previousValue","value"].sort().toString())}),Object.defineProperties(this,{defaultRuntime:{configurable:!1,enumerable:!1,get:function(){return function(bindHolder){Object.defineProperties(bindHolder,{settings:this.explicitNonConfigurable({mergeUpdates:!0,pause:!1}),updateQueue:this.explicitNonConfigurable([]),bindstore:this.explicitNonConfigurable({}),propstore:this.explicitNonConfigurable({})})}}},runUpdateQueue:{configurable:!1,enumerable:!1,get:function(){return function(bindHolder){if(!Array.isArray(bindHolder.updateQueue))throw new TypeError("Error with 'runUpdateQueue': unexpected format for 'updateQueue'");const updLen=bindHolder.updateQueue.length;for(let j=0;j<updLen;j++){const nextBinding=bindHolder.updateQueue.shift();"function"==typeof nextBinding&&nextBinding()}}}},addData:{configurable:!1,enumerable:!1,get:function(){return function(bindHolder,propertyName,propertyValue,dependencies){let typeCarrier,propName,propValue;const addsBindings=4===arguments.length;if("object"!=typeof bindHolder&&bindHolder!==dbind||null===bindHolder||"string"!=typeof arguments[1])throw new TypeError("addData: invalid arguments");if(!hasOwnProperty.call(bindHolder,"propstore")||!hasOwnProperty.call(bindHolder,"bindstore"))throw new TypeError("addData: missing propstore and/or bindstore");if(typeCarrier=this,propName=arguments[1].toString(),propValue=arguments[2],addsBindings&&(!Array.isArray(dependencies)||!dependencies.length))throw new TypeError("addData: invalid dependencies - "+dependencies);hasOwnProperty.call(bindHolder.propstore,propName)&&(delete bindHolder.propstore[propName],delete bindHolder.bindstore[propName]),Object.defineProperties(bindHolder.propstore[propName]={},{value:this.explicitNonConfigurable(addsBindings?propValue.bind(bindHolder.bindstore):propValue),previousValue:this.explicitNonConfigurable(addsBindings?null:propValue),dependencies:this.explicitNonConfigurable(addsBindings?dependencies:null)}),Object.defineProperty(bindHolder.bindstore,propName,{configurable:!0,enumerable:!0,get:function(){return bindHolder.propstore[this].value}.bind(propName),set:function(value){Object.getOwnPropertyNames(bindHolder.propstore[this]).sort().toString()!==typeCarrier.storeMemberKeys?console.warn("Unexpected format for propstore."):value!==bindHolder.propstore[this].value&&(bindHolder.propstore[this].previousValue=bindHolder.propstore[this].value,bindHolder.propstore[this].value=value,typeCarrier.updateDataBindings(bindHolder,this.toString()))}.bind(propName)})}}},updateDataBindings:{configurable:!1,enumerable:!1,get:function(){return function(){if(2!==arguments.length||"object"!=typeof arguments[0]&&arguments[0]!==dbind||"string"!=typeof arguments[1])throw new TypeError("'updateDataBindings' unexpected arguments.");const bindHolder=arguments[0],pSeek=arguments[1].toString(),bhkeys=Object.keys(bindHolder.propstore),bhkeysLen=bhkeys.length;let pName,ppp,dpd;try{for(let i=0;i<bhkeysLen;i++)pName=bhkeys[i],ppp=bindHolder.propstore[pName],dpd=ppp.dependencies,null!==dpd&&-1!==dpd.indexOf(pSeek)&&(bindHolder.settings.mergeUpdates?-1===bindHolder.updateQueue.indexOf(ppp.value)&&bindHolder.updateQueue.push(ppp.value):ppp.value());bindHolder.propstore[pSeek].previousValue=bindHolder.propstore[pSeek].value}catch(e){console.error("Error while updating bindings depending on "+pSeek+" - "+e.message)}}}},reset:{configurable:!1,enumerable:!1,get:function(){return function(){const bindHolder=arguments[0]||dbind,typeCarrier=this||dbind.prototype;if(!hasOwnProperty.call(bindHolder,"settings"))throw new TypeError("'Reset' called on incompatible object.");typeCarrier.defaultRuntime(bindHolder)}}},pause:{configurable:!1,enumerable:!1,get:function(){return function(){const bindHolder=arguments[0]||dbind;if(!hasOwnProperty.call(bindHolder,"settings"))throw new TypeError("'Pause' called on incompatible object.");bindHolder.settings.pause=!0}}},resume:{configurable:!1,enumerable:!1,get:function(){return function(){const bindHolder=arguments[0]||dbind,typeCarrier=this||dbind.prototype;if(!hasOwnProperty.call(bindHolder,"settings"))throw new TypeError("'Resume' called on incompatible object.");bindHolder.settings.pause=!1,typeCarrier.refresh(bindHolder)}}},refresh:{configurable:!1,enumerable:!1,get:function(){return function(){let bhkeys,bhkeysLen,ppp,pName;const bindHolder=arguments[0]||dbind,typeCarrier=this||dbind.prototype,originalPauseStatus=bindHolder.settings.pause;bindHolder.settings.pause=!1;try{bhkeys=Object.keys(bindHolder.propstore),bhkeysLen=bhkeys.length;for(let i=0;i<bhkeysLen;i++)pName=bhkeys[i],ppp=bindHolder.propstore[pName],null===ppp.dependencies&&ppp.value!==ppp.previousValue&&typeCarrier.updateDataBindings(bindHolder,pName);bindHolder.settings.mergeUpdates&&typeCarrier.runUpdateQueue(bindHolder)}catch(e){console.error('Error with "refresh": ',e.message)}finally{bindHolder.settings.pause=originalPauseStatus}}}},update:{configurable:!1,enumerable:!1,get:function(){return function(){this.constructor.apply(this,arguments)}}}})}.call(dbind.prototype),Object.seal(dbind.prototype);export{dbind};