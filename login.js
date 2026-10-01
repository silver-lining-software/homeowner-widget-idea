(() => {
 const auth=window.AtixAuth,params=new URLSearchParams(location.search),allowed=['customer-info.html','project-dashboard.html','estimate.html'],next=allowed.includes(params.get('next'))?params.get('next'):'customer-info.html';
 document.getElementById('loginBack').href='project-dashboard.html?project='+encodeURIComponent(auth.project());
 const verify=email=>{const existing=auth.read('atix-pending-login');const profile=existing?.project===auth.project()?existing.profile:null;auth.write('atix-pending-login',{email,next,project:auth.project(),profile:profile?{...profile,email}:null});window.AtixVerification.open();};
 document.getElementById('signInForm').addEventListener('submit',event=>{event.preventDefault();verify(document.getElementById('signInEmail').value.trim());});
 document.getElementById('googleSignIn').addEventListener('click',()=>{auth.signIn({firstName:'Demo',lastName:'User',email:'demo@example.com',phone:''});location.href=auth.route(next);});
 const pending=auth.read('atix-pending-login');if(params.get('verify')==='1'&&pending?.project===auth.project()){document.getElementById('signInEmail').value=pending.email;window.AtixVerification.open();}
})();
