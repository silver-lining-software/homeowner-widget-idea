(() => {
 const auth=window.AtixAuth,store=window.AtixEstimate,state=store.load();
 if(!auth?.user())return;
 const get=id=>document.getElementById(id),footer=get('requestActions'),message=get('requestConfirmation');
 const ready=()=>store.completion(state).every(Boolean)&&!state.submitted;
 function sent(){
  get('actionKicker').textContent='REQUEST SENT';get('nextTitle').textContent='Your request has been sent';get('nextDescription').textContent='Your project is in review. We’ll let you know as soon as there’s an update.';get('requestStatus').textContent='Sent';get('requestStatus').classList.remove('saved');get('requestStatus').classList.add('completed');get('requestSummary').textContent='Your request has been submitted in this prototype.';
  document.querySelector('.dashboard').classList.add('request-submitted');document.querySelector('.next-action').classList.add('request-banner');
  document.querySelectorAll('.overview-card .manage-button,.contact-edit').forEach(link=>link.hidden=true);
  document.querySelectorAll('.scope-summary,.labor-summary').forEach(link=>{link.removeAttribute('href');link.removeAttribute('data-step');link.style.cursor='default';link.querySelector('.chevron')?.remove();if(link.classList.contains('labor-summary'))link.lastElementChild?.remove();});
  get('nextAction').hidden=true;get('requestLink').hidden=true;footer.replaceChildren();footer.hidden=true;get('contractorReview').hidden=false;
 }
 function send(){if(!auth.user()||!ready())return;state.submitted={total:store.total(state),timestamp:new Date().toISOString(),source:'overview',snapshot:JSON.parse(JSON.stringify({fields:state.fields,scopes:state.scopes,tasks:state.tasks}))};state.stage='request';store.save(state);sent();message.hidden=false;message.textContent='Request sent successfully. Your project information has been saved in this prototype; no information was sent to an external contractor.';message.tabIndex=-1;message.focus();}
 if(state.submitted){sent();return;}
 if(!ready())return;
 get('actionKicker').textContent='READY TO SEND';get('nextTitle').textContent='Review your project before sending';get('nextDescription').textContent='Make sure the project details, contact information, workscopes and estimate are correct. Send Request will submit this information.';get('requestSummary').textContent='All steps are complete. Review the information above, then send your request.';get('requestStatus').textContent='Ready to send';
 get('requestLink').hidden=true;footer.hidden=false;const copy=document.createElement('p');copy.textContent='Everything looks correct? Send your request to the contractor.';footer.append(copy);
 const top=document.createElement('button');top.type='button';top.id='nextAction';top.className='continue-button';top.textContent='Send Request →';top.addEventListener('click',send);get('nextAction').replaceWith(top);
 const bottom=document.createElement('button');bottom.type='button';bottom.className='request-primary-button';bottom.textContent='Send Request →';bottom.addEventListener('click',send);footer.append(bottom);
})();

