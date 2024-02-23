import{ai as be,q as s,o as F,ax as we,b4 as he,aB as w,y as i,al as _,z as k,h as n,x as l,v as P,A as c,an as S,az as z,B as Ie,am as h,ao as xe,b5 as Ee,b6 as Oe,b7 as Ce,b8 as Ne,b9 as Pe,ba as Se,bb as ze,ad as Ae,H as Re,bc as Ue,aq as $e,aO as De,L as Fe,O as Te,F as Be,aI as Le,K as Ve,aJ as qe}from"./index-TwhPk9NU.js";import{_ as Me}from"./index-IZbu6eKj.js";import{_ as Ke}from"./index-jRt2O7V0.js";import{_ as je}from"./index-CgjrgbsS.js";import{_ as He}from"./index-ydpq3ULG.js";import{_ as Je}from"./index-umg4-B7O.js";import{a as Ge}from"./index-EbxQddqb.js";import"./Checkbox-m_Qp4csq.js";const Qe={class:"flex w-full bg-white"},We={class:"left p-2"},Xe={class:"right p-2"},Ye={key:0},Ze={key:1},et={class:"font-bold"},tt={class:"flex justify-end p-2"},at={__name:"index",setup(nt){const J={title:"name",children:"children",key:"id"},f=s([]);F(()=>{G()});let A=s(!1);const G=async()=>{A.value=!0;const a=await we();f.value=Q(a),A.value=!1},Q=a=>{let e=Object.create(null),u=[];return a.forEach(o=>e[o.id]={...o,children:[]}),a.forEach(o=>{let d=e[o.pid];d?d.children.push(e[o.id]):u.push(e[o.id])}),u},W=[{title:"头像",dataIndex:"staffPhoto",key:"staffPhoto",width:80},{title:"姓名",dataIndex:"username",key:"username",width:120},{title:"手机号",dataIndex:"mobile",key:"mobile",width:120},{title:"工号",dataIndex:"workNumber",key:"workNumber",width:120,sorter:(a,e)=>a.workNumber.slice(5)-e.workNumber.slice(5)},{title:"聘用形式",dataIndex:"formOfEmployment",key:"formOfEmployment",width:120},{title:"部门",dataIndex:"departmentName",key:"departmentName"},{title:"入职时间",dataIndex:"timeOfEntry",key:"timeOfEntry",width:120,sorter:(a,e)=>{const u=a.timeOfEntry.replace(/-/g,""),o=e.timeOfEntry.replace(/-/g,"");return u-o}},{title:"操作",key:"action",width:166,fixed:"right"}],p=s({keyword:"",page:1,pagesize:10,departmentId:1}),T=s([]),B=s(0),I=s(!1);F(()=>{v()});const v=async(a,e)=>{var u;try{I.value=!0,p.value.departmentId=((u=e==null?void 0:e.node)==null?void 0:u.id)||1;const o=await he(p.value);T.value=o.rows,B.value=o.total,I.value=!1}catch(o){console.log(o),w.warning("接口异常!"),I.value=!1}},m=s([]),X={onChange:(a,e)=>{m.value=e}},Y=(a,e)=>{p.page=a,p.pagesize=e,v()},Z=[{label:"通知消息",value:1},{label:"提示消息",value:2},{label:"重要消息",value:3},{label:"紧急消息",value:4}],x=s(!1),R=s(!1),E=s(null),ee=()=>{if(m.value.length===0)return w.warning("请先选择通知员工!");x.value=!0},y=s({content:"",type:1,userIds:[]}),te={content:[{required:!0,message:"消息内容不能为空",trigger:"blur"}],type:[{required:!0,message:"消息等级不能为空",trigger:"blur"}]},ae=a=>{m.value=m.value.filter(e=>e.id!==a)},ne=()=>{E.value.validate().then(async()=>{R.value=!0,await Oe({...y.value,userIds:m.value.map(a=>a.id)}),w.success("通知发送成功!"),E.value.resetFields(),R.value=!1,x.value=!1})},oe=async a=>{await Ce(a.id),w.success("删除员工成功!"),v()},U=s(""),O=s(!1),g=s({username:"",workNumber:"",mobile:"",departmentId:null,formOfEmployment:1,timeOfEntry:"",correctionTime:"",staffPhoto:""}),L=async(a,e)=>{U.value=a,a==="update"&&await V(e.id),O.value=!0},V=async a=>{const e=await Ne(a);let u=q(f.value,e.departmentId);g.value={...e,departmentId:u}},q=(a,e,u=[])=>{for(const o of a){if(o.id===e)return[...u,o.id];if(o.children&&o.children.length){const d=q(o.children,e,[...u,o.id]);if(d)return d}}return null},le=()=>{O.value=!1,g.value={username:"",workNumber:"",mobile:"",departmentId:null,formOfEmployment:1,timeOfEntry:"",correctionTime:"",staffPhoto:""}},M=s([]),C=s([]),N=s(!1),$=s(!1),se=async()=>{const a=await Pe();M.value=a.map(e=>({label:e.name,value:e.id}))};F(()=>{se()});const ue=async a=>{await V(a.id),C.value=g.value.roleIds,N.value=!0},re=async()=>{$.value=!0,await Se({id:g.value.id,roleIds:C.value}),w.success("更新角色成功!"),N.value=!1,$.value=!1};return(a,e)=>{const u=ze,o=je,d=Ae,b=Re,ie=Ue,pe=Me,K=$e,ce=He,de=Je,me=Ge,_e=De,fe=Fe,ve=Te,j=Be,ye=Le,ge=Ve,H=qe,ke=Ke;return i(),_(h,null,[k("div",Qe,[k("div",We,[n(d,{spinning:Ie(A)},{default:l(()=>[n(u,{value:p.value.keyword,"onUpdate:value":e[0]||(e[0]=t=>p.value.keyword=t),placeholder:"输入员工姓名搜索","enter-button":"",onSearch:v,class:"mb-2"},null,8,["value"]),f.value.length?(i(),P(o,{key:0,autoExpandParent:!0,"tree-data":f.value,"field-names":J,defaultExpandAll:!0,"block-node":"",onSelect:v},{title:l(({id:t,name:r,managerName:D,code:ot,introduce:lt,managerId:st,pid:ut,createTime:rt})=>[c(S(r),1)]),_:1},8,["tree-data"])):z("",!0)]),_:1},8,["spinning"])]),k("div",Xe,[n(d,{spinning:I.value},{default:l(()=>[n(pe,{class:"mb-2"},{default:l(()=>[n(b,{onClick:ee},{default:l(()=>[c("群发通知")]),_:1}),n(b,{type:"primary",onClick:e[1]||(e[1]=t=>L("add"))},{default:l(()=>[n(ie),c(" 添加员工 ")]),_:1})]),_:1}),n(de,{"row-selection":X,columns:W,"data-source":T.value,scroll:{x:1100},pagination:!1,rowKey:"id"},{bodyCell:l(({column:t,record:r})=>[t.key==="staffPhoto"?(i(),_(h,{key:0},[r.staffPhoto?(i(),P(K,{key:0,class:"my-avatar",src:r.staffPhoto},null,8,["src"])):(i(),P(K,{key:1,class:"my-avatar"},{default:l(()=>[c(S(r.username.charAt(0)),1)]),_:2},1024))],64)):z("",!0),t.key==="formOfEmployment"?(i(),_(h,{key:1},[r.formOfEmployment===1?(i(),_("span",Ye,"正式")):(i(),_("span",Ze,"非正式"))],64)):z("",!0),t.key==="action"?(i(),_(h,{key:2},[n(b,{type:"link",size:"small",onClick:D=>L("update",r)},{default:l(()=>[c("编辑")]),_:2},1032,["onClick"]),n(b,{type:"link",size:"small",onClick:D=>ue(r)},{default:l(()=>[c("角色")]),_:2},1032,["onClick"]),n(ce,{placement:"bottom","ok-text":"删除","cancel-text":"取消",onConfirm:D=>oe(r)},{title:l(()=>[k("div",null,[c("确定要删除 "),k("span",et,S(r.username),1),c(" 吗?")])]),default:l(()=>[n(b,{type:"link",size:"small"},{default:l(()=>[c("删除")]),_:1})]),_:2},1032,["onConfirm"])],64)):z("",!0)]),_:1},8,["data-source"]),k("div",tt,[n(me,{current:p.value.page,"onUpdate:current":e[2]||(e[2]=t=>p.value.page=t),"page-size":p.value.pagesize,"onUpdate:pageSize":e[3]||(e[3]=t=>p.value.pagesize=t),"show-quick-jumper":"",total:B.value,"show-total":t=>`共 ${t} 条`,onChange:Y},null,8,["current","page-size","total","show-total"])])]),_:1},8,["spinning"])])]),n(H,{open:x.value,"onUpdate:open":e[6]||(e[6]=t=>x.value=t),title:"群发通知",onOk:ne,onCancel:e[7]||(e[7]=t=>E.value.resetFields()),destroyOnClose:!0,"confirm-loading":R.value},{default:l(()=>[n(fe,{class:"mb-2"},{default:l(()=>[(i(!0),_(h,null,xe(m.value,t=>(i(),P(_e,{class:"mb-2",closable:m.value.length!==1,onClose:r=>ae(t.id),color:"purple",key:t.id},{default:l(()=>[c("@"+S(t.username),1)]),_:2},1032,["closable","onClose"]))),128))]),_:1}),n(ge,{ref_key:"sendFormRef",ref:E,model:y.value,rules:te},{default:l(()=>[n(j,{label:"消息等级",name:"type","has-feedback":""},{default:l(()=>[n(ve,{value:y.value.type,"onUpdate:value":e[4]||(e[4]=t=>y.value.type=t),options:Z},null,8,["value"])]),_:1}),n(j,{label:"通知内容",name:"content","has-feedback":""},{default:l(()=>[n(ye,{value:y.value.content,"onUpdate:value":e[5]||(e[5]=t=>y.value.content=t),placeholder:"请输入通知内容","show-count":"",maxlength:100,rows:3},null,8,["value"])]),_:1})]),_:1},8,["model"])]),_:1},8,["open","confirm-loading"]),n(Ee,{treeData:f.value,"onUpdate:treeData":e[8]||(e[8]=t=>f.value=t),type:U.value,"onUpdate:type":e[9]||(e[9]=t=>U.value=t),open:O.value,"onUpdate:open":e[10]||(e[10]=t=>O.value=t),formState:g.value,"onUpdate:formState":e[11]||(e[11]=t=>g.value=t),onOnSelect:v,onCancel:le},null,8,["treeData","type","open","formState"]),n(H,{open:N.value,"onUpdate:open":e[13]||(e[13]=t=>N.value=t),title:"分配角色",onOk:re,destroyOnClose:!0,"confirm-loading":$.value},{default:l(()=>[n(ke,{value:C.value,"onUpdate:value":e[12]||(e[12]=t=>C.value=t),options:M.value},null,8,["value","options"])]),_:1},8,["open","confirm-loading"])],64)}}},yt=be(at,[["__scopeId","data-v-0af44a38"]]);export{yt as default};