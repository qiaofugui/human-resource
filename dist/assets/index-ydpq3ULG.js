import{P as X,b as Z,c as J,i as Q,m as r,bd as U,q as G,be as Y,W as ee,X as ne,V as oe,f as j,Z as te,bf as ae,aS as le,a0 as se,h as i,bg as ie,_ as k,bh as re,J as ce,bi as ue,aQ as f,aZ as pe,k as I,bj as de,bk as z,H as fe,bl as me,bm as ve}from"./index-TwhPk9NU.js";const ge=n=>{const{componentCls:l,iconCls:t,zIndexPopup:a,colorText:s,colorWarning:y,marginXS:p,fontSize:c,fontWeightStrong:b,lineHeight:d}=n;return{[l]:{zIndex:a,[`${l}-inner-content`]:{color:s},[`${l}-message`]:{position:"relative",marginBottom:p,color:s,fontSize:c,display:"flex",flexWrap:"nowrap",alignItems:"start",[`> ${l}-message-icon ${t}`]:{color:y,fontSize:c,flex:"none",lineHeight:1,paddingTop:(Math.round(c*d)-c)/2},"&-title":{flex:"auto",marginInlineStart:p},"&-title-only":{fontWeight:b}},[`${l}-description`]:{position:"relative",marginInlineStart:c+p,marginBottom:p,color:s,fontSize:c},[`${l}-buttons`]:{textAlign:"end",button:{marginInlineStart:p}}}}},Ce=X("Popconfirm",n=>ge(n),n=>{const{zIndexPopupBase:l}=n;return{zIndexPopup:l+60}});var ye=function(n,l){var t={};for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&l.indexOf(a)<0&&(t[a]=n[a]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,a=Object.getOwnPropertySymbols(n);s<a.length;s++)l.indexOf(a[s])<0&&Object.prototype.propertyIsEnumerable.call(n,a[s])&&(t[a[s]]=n[a[s]]);return t};const be=()=>r(r({},ue()),{prefixCls:String,content:f(),title:f(),description:f(),okType:pe("primary"),disabled:{type:Boolean,default:!1},okText:f(),cancelText:f(),icon:f(),okButtonProps:I(),cancelButtonProps:I(),showCancel:{type:Boolean,default:!0},onConfirm:Function,onCancel:Function}),xe=J({compatConfig:{MODE:3},name:"APopconfirm",inheritAttrs:!1,props:Q(be(),r(r({},U()),{trigger:"click",placement:"top",mouseEnterDelay:.1,mouseLeaveDelay:.1,arrowPointAtCenter:!1,autoAdjustOverflow:!0,okType:"primary",disabled:!1})),slots:Object,setup(n,l){let{slots:t,emit:a,expose:s,attrs:y}=l;const p=G();Y(n.visible===void 0),s({getPopupDomNode:()=>{var e,o;return(o=(e=p.value)===null||e===void 0?void 0:e.getPopupDomNode)===null||o===void 0?void 0:o.call(e)}});const[c,b]=ee(!1,{value:ne(n,"open")}),d=(e,o)=>{n.open===void 0&&b(e),a("update:open",e),a("openChange",e,o)},D=e=>{d(!1,e)},T=e=>{var o;return(o=n.onConfirm)===null||o===void 0?void 0:o.call(n,e)},A=e=>{var o;d(!1,e),(o=n.onCancel)===null||o===void 0||o.call(n,e)},E=e=>{e.keyCode===ve.ESC&&c&&d(!1,e)},R=e=>{const{disabled:o}=n;o||d(e)},{prefixCls:u,getPrefixCls:h}=oe("popconfirm",n),V=j(()=>h()),W=j(()=>h("btn")),[F]=Ce(u),[O]=te("Popconfirm",ae.Popconfirm),H=()=>{var e,o,m,v,g;const{okButtonProps:C,cancelButtonProps:x,title:P=(e=t.title)===null||e===void 0?void 0:e.call(t),description:_=(o=t.description)===null||o===void 0?void 0:o.call(t),cancelText:L=(m=t.cancel)===null||m===void 0?void 0:m.call(t),okText:K=(v=t.okText)===null||v===void 0?void 0:v.call(t),okType:S,icon:B=((g=t.icon)===null||g===void 0?void 0:g.call(t))||i(de,null,null),showCancel:M=!0}=n,{cancelButton:w,okButton:N}=t,$=r({onClick:A,size:"small"},x),q=r(r(r({onClick:T},z(S)),{size:"small"}),C);return i("div",{class:`${u.value}-inner-content`},[i("div",{class:`${u.value}-message`},[B&&i("span",{class:`${u.value}-message-icon`},[B]),i("div",{class:[`${u.value}-message-title`,{[`${u.value}-message-title-only`]:!!_}]},[P])]),_&&i("div",{class:`${u.value}-description`},[_]),i("div",{class:`${u.value}-buttons`},[M?w?w($):i(fe,$,{default:()=>[L||O.value.cancelText]}):null,N?N(q):i(me,{buttonProps:r(r({size:"small"},z(S)),C),actionFn:T,close:D,prefixCls:W.value,quitOnNullishReturnValue:!0,emitEvent:!0},{default:()=>[K||O.value.okText]})])])};return()=>{var e;const{placement:o,overlayClassName:m,trigger:v="click"}=n,g=ye(n,["placement","overlayClassName","trigger"]),C=le(g,["title","content","cancelText","okText","onUpdate:open","onConfirm","onCancel","prefixCls"]),x=se(u.value,m);return F(i(ce,k(k(k({},C),y),{},{trigger:v,placement:o,onOpenChange:R,open:c.value,overlayClassName:x,transitionName:re(V.value,"zoom-big",n.transitionName),ref:p,"data-popover-inject":!0}),{default:()=>[ie(((e=t.default)===null||e===void 0?void 0:e.call(t))||[],{onKeydown:P=>{E(P)}},!1)],content:H}))}}}),_e=Z(xe);export{_e as _};