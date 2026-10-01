(() => {
 const store=window.AtixEstimate,state=store.load(),cards=document.getElementById('equipmentCards'),body=document.getElementById('laborTasks'),empty=document.getElementById('emptyLabor'),announce=document.getElementById('laborAnnouncement'),checked=document.getElementById('estimateReviewed'),review=document.getElementById('reviewEstimate'),status=document.getElementById('estimateStatus');
 const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);let total=0;
 function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function edited(){checked.checked=false;review.disabled=true;status.textContent='';delete state.submitted;state.estimateReviewed=false;store.save(state);}
 state.scopes.forEach(scope=>{
  const system=store.systems[scope.system]||store.systems.central,card=element('article','equipment-card'),top=element('div','equipment-card-top'),copy=element('div');copy.append(element('span','equipment-eyebrow',scope.name||'Unnamed workscope'),element('h3','',system.name));const qty=element('div','equipment-count');qty.append(element('span','','Qty'),element('strong','','1'));top.append(copy,qty);card.append(top);
  if(scope.ahri){const reference=element('div','ahri-reference');reference.append(element('span','','AHRI matchup'),element('strong','',scope.ahri));card.append(reference);}
  const heading=element('div','equipment-table-head');heading.append(element('span','','Equipment'),element('span','','Price'));card.append(heading);
  const list=element('ul','equipment-list');
  function equipment(name,index,accessory=false){const item=element('li'),icon=element('span','equipment-icon');icon.innerHTML='<i class="bi '+(accessory?'bi-gear':'bi-image')+'" aria-hidden="true"></i>';const text=element('div','equipment-description'),model=element('strong','','DEMO-'+scope.system.toUpperCase()+'-'+String(index+1).padStart(2,'0'));model.append(element('em','',' (1 unit)'));text.append(model,element('small','',name));const price=accessory?125:2500;total+=price;item.append(icon,text,element('span','equipment-price',money(price)));list.append(item);}
  system.equipment.forEach((name,index)=>equipment(name,index));String(scope.accessories||'').split(',').map(value=>value.trim()).filter(Boolean).forEach((name,index)=>equipment(name,index,true));card.append(list);cards.append(card);
 });
 document.getElementById('estimateTotal').textContent=money(total);
 function updateEmpty(){empty.hidden=state.tasks.length>0;}
 function addRow(task,focus=false){
  const row=element('tr'),cell=element('td'),wrap=element('div','labor-input-wrap'),input=element('input','form-control');input.type='text';input.placeholder='Enter a labor task';input.value=task.description;input.required=true;input.setAttribute('aria-label','Labor task description');input.addEventListener('input',()=>{task.description=input.value;edited();});wrap.append(element('span','labor-dash','–'),input);cell.append(wrap);
  const action=element('td'),remove=element('button','btn delete-task');remove.type='button';remove.innerHTML='<i class="bi bi-trash3" aria-hidden="true"></i>';remove.setAttribute('aria-label','Delete labor task');remove.title='Delete labor task';remove.addEventListener('click',()=>{const index=state.tasks.findIndex(item=>item.id===task.id);if(index>=0)state.tasks.splice(index,1);const neighbor=row.nextElementSibling||row.previousElementSibling;row.remove();edited();updateEmpty();announce.textContent='Labor task deleted. '+state.tasks.length+' tasks remaining.';(neighbor?.querySelector('input')||document.getElementById('addLaborTask')).focus();});action.append(remove);row.append(cell,action);body.append(row);if(focus)input.focus();
 }
 state.tasks.forEach(task=>addRow(task));updateEmpty();
 document.getElementById('addLaborTask').addEventListener('click',()=>{const task={id:crypto.randomUUID(),description:'',scopeId:state.scopes[0]?.id||''};state.tasks.push(task);edited();addRow(task,true);updateEmpty();announce.textContent='New labor task added. '+state.tasks.length+' tasks.';});
 checked.addEventListener('change',()=>{review.disabled=!checked.checked;state.estimateReviewed=checked.checked;store.save(state);});
 review.addEventListener('click',()=>{if(!checked.checked)return;const invalid=[...body.querySelectorAll('input')].find(input=>!input.value.trim());if(invalid){invalid.focus();invalid.reportValidity();return;}state.estimateReviewed=true;store.save(state);location.href='project-dashboard.html?project='+encodeURIComponent(store.activeId);});
})();
