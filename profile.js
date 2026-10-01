(() => {
 const auth=window.AtixAuth,user=auth.user();if(!user)return;
 document.getElementById('profileBack').href=auth.route('project-dashboard.html');
 const fields={firstName:document.getElementById('profileFirstName'),lastName:document.getElementById('profileLastName'),email:document.getElementById('profileEmail'),phone:document.getElementById('profilePhone')};
 for(const [key,input] of Object.entries(fields))input.value=user[key]||'';
 document.getElementById('profileForm').addEventListener('submit',event=>{event.preventDefault();const saved=auth.updateProfile({firstName:fields.firstName.value,lastName:fields.lastName.value,phone:fields.phone.value});fields.email.value=saved.email;document.getElementById('profileStatus').textContent='Your profile has been saved.';});
})();
