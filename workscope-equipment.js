(() => {
 const store=window.AtixEstimate,state=store.load();
 let active=Math.max(0,state.scopes.findIndex(scope=>scope.id===new URLSearchParams(location.search).get('scope')));
 const tabs=document.querySelector('.workscope-tabs'),add=document.querySelector('.workscope-add');
 if(!tabs||!add)return;
 function render(){
  tabs.querySelectorAll('.workscope-tab').forEach(tab=>tab.remove());
  state.scopes.forEach((scope,index)=>{
   const button=document.createElement('button');
   button.type='button';button.className='workscope-tab'+(index===active?' active':'');
   button.textContent=scope.name||'Unnamed workscope';button.setAttribute('aria-pressed',String(index===active));
   button.addEventListener('click',()=>{active=index;render();});tabs.insertBefore(button,add);
  });
 }
 add.addEventListener('click',()=>{
  state.scopes.push({id:'scope-'+Date.now(),name:'Workscope '+(state.scopes.length+1),system:'central',ahri:'',accessories:'',configured:false});
  active=state.scopes.length-1;state.estimateReviewed=false;delete state.submitted;
  store.save(state);render();tabs.querySelectorAll('.workscope-tab')[active].focus();
 });
 render();
})();
