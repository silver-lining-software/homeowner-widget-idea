(() => {
 const auth=window.AtixAuth,dialog=document.getElementById('verificationDialog'),code=document.getElementById('loginCode'),error=document.getElementById('verificationError');
 function close(){dialog.close();document.getElementById('signInEmail').focus();}
 document.getElementById('differentEmail').href='#';
 document.getElementById('differentEmail').addEventListener('click',event=>{event.preventDefault();close();});
 document.getElementById('closeVerification').addEventListener('click',close);
 dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
 code.addEventListener('input',event=>{event.target.value=event.target.value.replace(/\D/g,'').slice(0,6);error.textContent='';});
 document.getElementById('verifyForm').addEventListener('submit',event=>{
  event.preventDefault();const pending=auth.read('atix-pending-login');
  if(!pending||pending.project!==auth.project()){error.textContent='Please request a new verification code.';return;}
  if(code.value!=='123456'){error.textContent='Enter the prototype code 123456.';return;}
  auth.signIn({...pending.profile,email:pending.email});auth.write('atix-pending-login',null);
  location.href=auth.route(['project-dashboard.html','estimate.html'].includes(pending.next)?pending.next:'customer-info.html');
 });
 window.AtixVerification={open(){const pending=auth.read('atix-pending-login');if(!pending||pending.project!==auth.project())return;document.getElementById('verificationDestination').textContent=pending.email;code.value='';error.textContent='';dialog.showModal();code.focus();}};
})();
