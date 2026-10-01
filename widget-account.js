(() => {
 const auth=window.AtixAuth,params=new URLSearchParams(location.search);if(params.get('mode')==='guest')auth.signOut();if(params.get('mode')==='member'&&!auth.user())auth.signIn({firstName:'Demo',lastName:'User',email:'demo@example.com',phone:'(512) 555-0187'});
 const screen=document.getElementById('widget-screen'),label=document.querySelector('.account strong'),menu=document.querySelector('.account-menu');
 function update(){const user=auth.user();label.textContent=user?[user.firstName,user.lastName].filter(Boolean).join(' ')||user.email:'Guest User';menu.replaceChildren();if(user){const profile=document.createElement('a');profile.className='account-menu-item';profile.textContent='Profile';profile.href=auth.route('profile.html');profile.target='widget-screen';profile.addEventListener('click',()=>{document.querySelector('.account').open=false;});menu.append(profile);}const button=document.createElement('button');button.type='button';button.className='account-menu-item';button.textContent=user?'Sign out':'Sign in';button.addEventListener('click',()=>{if(user){auth.signOut();screen.src='project-dashboard.html?project='+encodeURIComponent(auth.project());update();}else screen.src=auth.loginUrl('project-dashboard.html');document.querySelector('.account').open=false;});menu.append(button);}
 screen.addEventListener('load',update);window.addEventListener('message',event=>{if(event.source===screen.contentWindow&&event.data?.type==='atix:account')update();});update();
})();



