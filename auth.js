(() => {
 const read=key=>{try{return JSON.parse(sessionStorage.getItem(key));}catch{return null;}},write=(key,value)=>{try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}};
 const user=()=>read('atix-auth-user');
 const project=()=>window.AtixEstimate?.activeId||new URLSearchParams(location.search).get('project')||read('atix-active-project')||'draft';
 const loginUrl=(next='customer-info.html')=>'login.html?project='+encodeURIComponent(project())+'&next='+encodeURIComponent(next);
 function signIn(profile){write('atix-auth-user',profile);const store=window.AtixEstimate;if(store){const state=store.load();state.fields ||= {};Object.assign(state.fields,profile);store.save(state);}parent.postMessage({type:'atix:account'},'*');}
 function syncProfile(){const profile=user(),store=window.AtixEstimate;if(profile&&store){const state=store.load();state.fields ||= {};for(const key of ['firstName','lastName','email','phone'])state.fields[key]=profile[key]||'';store.save(state);}}
 function updateProfile(changes){const current=user();if(!current)return null;const profile={...current};for(const key of ['firstName','lastName','phone'])if(typeof changes[key]==='string')profile[key]=changes[key].trim();write('atix-auth-user',profile);syncProfile();parent.postMessage({type:'atix:account'},'*');return profile;}
 syncProfile();
 window.AtixAuth={user,write,read,project,loginUrl,signIn,updateProfile,syncProfile,signOut(){try{sessionStorage.removeItem('atix-auth-user');}catch{}},route(page){return !user()&&['estimate.html','proposal.html','profile.html'].includes(page)?loginUrl():page+'?embed=1&project='+encodeURIComponent(project());}};
 const page=location.pathname.split('/').pop();if(!user()&&['estimate.html','proposal.html','profile.html'].includes(page)){document.documentElement.style.visibility='hidden';location.replace(loginUrl());}
})();
