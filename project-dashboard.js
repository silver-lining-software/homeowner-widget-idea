(() => {
 const store=window.AtixEstimate,state=store.load(),fields=state.fields||{},done=store.completion(state),next=store.next(state),steps=['project.html','workscope.html','customer-info.html','estimate.html'];
 const get=id=>document.getElementById(id),money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
 const url=index=>steps[index]+'?embed=1&project='+encodeURIComponent(store.activeId);
 function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function status(id,complete){get(id).textContent=complete?'Completed':'Pending';get(id).classList.toggle('completed',complete);}
 document.querySelectorAll('[data-step]').forEach(link=>link.href=url(Number(link.dataset.step)));if(window.AtixAuth?.user())document.querySelector('.contact-edit').href=window.AtixAuth.route('profile.html');
 get('dashboardTitle').textContent='Project #'+store.activeId+' · '+(fields.projectName||state.template||'Untitled project');
 if(next){get('nextTitle').textContent='Next action: Complete '+next.label;get('nextDescription').textContent=['Add the project name and address to get started.','Configure the equipment and workscopes for this project.','Add your contact details so the contractor can follow up.','Review your selected hardware and add labor tasks.'][next.index];get('nextAction').href=next.url;}
 else{get('actionKicker').textContent=state.submitted?'REQUEST SAVED':'READY TO REVIEW';get('nextTitle').textContent=state.submitted?'All steps completed':'Next action: Review & Send';get('nextDescription').textContent=state.submitted?'Review the project and your saved request.':'Your project details are complete. Review the estimate before sending your request.';get('nextAction').textContent=state.submitted?'':'Review & Send →';get('nextAction').href=url(3);}
 status('projectStatus',done[0]);status('scopeStatus',done[1]);status('estimateStatus',done[3]);
 get('customerName').textContent=[fields.firstName,fields.lastName].filter(Boolean).join(' ')||'Contact not added yet';get('customerEmail').textContent=fields.email||'Email not added';get('customerPhone').textContent=fields.phone||'Phone not added';get('projectAddress').textContent=fields.projectAddress||'Address not added yet';
 get('scopeCount').textContent=state.scopes.length+' workscope'+(state.scopes.length===1?'':'s')+' added';
 state.scopes.forEach((scope,index)=>{const system=store.systems[scope.system]||store.systems.central,row=element('a','scope-summary');row.href=url(1)+'&scope='+encodeURIComponent(scope.id);const icon=element('span','section-icon');icon.innerHTML='<i class="bi bi-snow" aria-hidden="true"></i>';const copy=element('div','scope-copy');copy.append(element('h3','','Workscope #'+(index+1)+': '+(scope.name||'Unnamed workscope')),element('p','',system.name+(scope.ahri?' · AHRI '+scope.ahri:'')));const chip=element('span','status-chip'+(scope.configured?' completed':''),scope.configured?'Configured':'Pending');row.append(icon,copy,chip,element('span','chevron','›'));get('scopeList').append(row);
 system.equipment.forEach((name,equipmentIndex)=>{const card=element('div','equipment-preview');card.append(element('strong','','DEMO-'+scope.system.toUpperCase()+'-'+String(equipmentIndex+1).padStart(2,'0')),element('small','',name));get('equipmentOverview').append(card);});String(scope.accessories||'').split(',').map(item=>item.trim()).filter(Boolean).forEach(name=>{const card=element('div','equipment-preview');card.append(element('strong','','Accessory'),element('small','',name));get('equipmentOverview').append(card);});});
 get('laborCount').textContent=state.tasks.length+' labor task'+(state.tasks.length===1?'':'s')+' added';get('dashboardTotal').textContent=money(store.total(state));get('requestStatus').textContent=state.submitted?'Saved':'Not sent';get('requestStatus').classList.toggle('saved',Boolean(state.submitted));get('requestSummary').textContent=state.submitted?'Request saved in this prototype.':'Complete the estimate to prepare your request.';get('requestLink').textContent=state.submitted?'':'Prepare request →';
 function lockSection(statusId,label,description){
  const badge=get(statusId),card=badge.closest('.overview-card');
  card.classList.add('guest-disabled');card.setAttribute('aria-disabled','true');
  card.querySelectorAll('a,button').forEach(action=>{action.removeAttribute('href');action.setAttribute('aria-disabled','true');action.tabIndex=-1;action.hidden=true;});
  card.querySelector('.request-actions-footer')?.setAttribute('hidden','');
  badge.classList.remove('completed','saved');badge.replaceChildren();const lock=element('i','bi bi-lock');lock.setAttribute('aria-hidden','true');badge.append(lock,document.createTextNode(label));
  card.querySelector('.overview-heading p').textContent=description;
 }
 const auth=window.AtixAuth;if(auth?.user()&&!done[3])lockSection('requestStatus','Pending','Available after completing Estimate');
 if(auth&&!auth.user()){
 get('equipmentOverview').replaceChildren();get('equipmentOverview').hidden=true;
 get('laborCount').textContent='';document.querySelector('.labor-summary').hidden=true;
 get('dashboardTotal').textContent='';document.querySelector('.total-estimate').hidden=true;
 get('estimateStatus').closest('.overview-heading').querySelector('p').textContent='Available after signing in';
 get('requestSummary').textContent='Available after completing Estimate';
 get('contactStatus').hidden=false;get('customerName').textContent='Contact not added yet';get('customerEmail').textContent='Email not added';get('customerPhone').textContent='Phone not added';document.querySelector('.contact-edit').href=auth.loginUrl('project-dashboard.html');
 lockSection('estimateStatus','Pending','Available after signing in');
 lockSection('requestStatus','Pending','Available after completing Estimate');
 const pending=[0,1].find(index=>!done[index]);if(pending===undefined){get('actionKicker').textContent='SIGN IN REQUIRED';get('nextTitle').textContent='Next action: Sign in';get('nextDescription').textContent='Sign in to add your contact details and continue to Estimate.';get('nextAction').textContent='Sign in →';get('nextAction').href=auth.loginUrl();}
 }
})();




