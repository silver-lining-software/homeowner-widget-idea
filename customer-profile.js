(() => {
 const auth=window.AtixAuth,user=auth.user(),keys=['firstName','lastName','email','phone'],email=document.getElementById('email'),form=document.querySelector('.customer-card form'),review=document.querySelector('.customer-card a[href]'),google=document.getElementById('contactGoogle'),divider=document.getElementById('contactDivider');
 if(user){
  for(const key of keys)document.getElementById(key).value=user[key]||'';
  email.readOnly=true;email.setAttribute('aria-readonly','true');email.style.background='#f6f8fa';google.hidden=true;divider.hidden=true;
  const link=document.createElement('a');link.href=auth.route('profile.html');link.textContent='Manage my profile →';link.style.cssText='display:block;text-align:center;margin-top:18px;font-size:12px;color:#137ca7';document.querySelector('.customer-card').append(link);return;
 }
 document.querySelector('.screen-subtitle').textContent='Tell us how the contractor can reach you about your project.';
 email.readOnly=false;email.removeAttribute('aria-readonly');document.getElementById('contactEmailNote').hidden=true;
 // Restore only contact details typed by this guest, rather than fixture contacts.
 const draft=auth.read('atix-guest-contact-'+auth.project())||{};
 for(const key of keys){const field=document.getElementById(key);field.value=draft[key]||'';field.required=true;field.addEventListener('input',()=>{draft[key]=field.value;auth.write('atix-guest-contact-'+auth.project(),draft);});}
 const continueWithEmail=event=>{event.preventDefault();if(!form.reportValidity())return;const profile=Object.fromEntries(keys.map(key=>[key,document.getElementById(key).value.trim()]));if(!profile.firstName||!profile.lastName||!profile.phone)return;auth.write('atix-pending-login',{email:profile.email,profile,next:'estimate.html',project:auth.project()});location.href=auth.loginUrl('estimate.html')+'&verify=1';};
 review.href=auth.loginUrl('estimate.html');review.addEventListener('click',continueWithEmail);form.addEventListener('submit',continueWithEmail);
 google.addEventListener('click',()=>{auth.signIn({firstName:'Demo',lastName:'User',email:'demo@example.com',phone:'(512) 555-0187'});location.href=auth.route('customer-info.html');});
})();
