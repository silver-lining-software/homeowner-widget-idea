// Template catalog and search adapted from the supplied HVAC prototype.
(() => {
  'use strict';
  const templates = [
    { id: 1, name: 'Install central HVAC system', category: 'Heating and cooling', icon: 'bi-snow', keywords: 'central hvac air conditioner furnace cooling heating replacement' },
    { id: 2, name: 'Install heat pump and fan coil', category: 'Heat pump', icon: 'bi-fan', keywords: 'heat pump fan coil electric heating cooling' },
    { id: 3, name: 'Install new furnace', category: 'Heating', icon: 'bi-fire', keywords: 'furnace gas heating new installation' },
    { id: 4, name: 'Replace air conditioning system', category: 'Air conditioning', icon: 'bi-wind', keywords: 'ac air conditioning cooling replacement' },
    { id: 5, name: 'Install ductless mini-split', category: 'Heating and cooling', icon: 'bi-grid-1x2', keywords: 'mini split ductless heat pump zones' },
    { id: 6, name: 'Install packaged HVAC unit', category: 'Heating and cooling', icon: 'bi-box', keywords: 'packaged rooftop unit hvac' },
    { id: 7, name: 'Replace evaporator coil', category: 'Air conditioning', icon: 'bi-moisture', keywords: 'coil evaporator cooling repair replacement' }
  ];

  function initTemplateSearch() {
    const input = document.querySelector('#templateSearch');
    if (!input) return;
    const form = document.querySelector('#templateSearchForm');
    const results = document.querySelector('#templateResults');
    const announcement = document.querySelector('#searchAnnouncement');
    let matches = [], activeIndex = -1, selectedTemplate = null;

    const filterTemplates = query => {
      const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (!terms.length) return templates.slice(0, 3);
      return templates.filter(template => {
        const content = `${template.name} ${template.category} ${template.keywords}`.toLowerCase();
        return terms.every(term => content.includes(term));
      });
    };
    const closeResults = () => {
      results.hidden = true; input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant'); activeIndex = -1;
    };
    const selectTemplate = template => {
      selectedTemplate = template; input.value = template.name; closeResults();

    };
    const renderResults = () => {
      matches = filterTemplates(input.value); activeIndex = -1; input.removeAttribute('aria-activedescendant'); results.replaceChildren();
      if (!matches.length) {
        results.innerHTML = '<div class="no-results"><strong>No services found</strong>Try a broader term such as “HVAC”, “heating” or “cooling”.</div>';
        announcement.textContent = `No HVAC services found for ${input.value}.`;
      } else {
        matches.forEach((template, index) => {
          const option = document.createElement('button');
          option.type = 'button'; option.className = 'template-option'; option.id = `template-option-${template.id}`;
          option.setAttribute('role', 'option'); option.setAttribute('aria-selected', 'false'); option.dataset.index = index;
          option.innerHTML = `<span class="template-icon"><i class="bi ${template.icon}"></i></span><span><span class="template-name">${template.name}</span><span class="template-meta">${template.category} · Guided project setup</span></span><i class="bi bi-chevron-right"></i>`;
          option.addEventListener('click', () => selectTemplate(template)); results.append(option);
        });
        announcement.textContent = `${matches.length} HVAC service${matches.length === 1 ? '' : 's'} found.`;
      }
      results.hidden = false; input.setAttribute('aria-expanded', 'true');
    };
    const moveActive = direction => {
      const options = [...results.querySelectorAll('.template-option')]; if (!options.length) return;
      activeIndex = activeIndex < 0 ? (direction > 0 ? 0 : options.length - 1) : (activeIndex + direction + options.length) % options.length;
      options.forEach((option, index) => { const active = index === activeIndex; option.classList.toggle('is-active', active); option.setAttribute('aria-selected', String(active)); });
      input.setAttribute('aria-activedescendant', options[activeIndex].id); options[activeIndex].scrollIntoView({ block: 'nearest' });
    };

    form.addEventListener('submit', event => {
      event.preventDefault();
      const candidates=filterTemplates(input.value);
      const template=selectedTemplate&&selectedTemplate.name===input.value.trim()?selectedTemplate:templates.find(item=>item.name.toLowerCase()===input.value.trim().toLowerCase())||(input.value.trim()&&candidates.length===1?candidates[0]:null);
      if(!template){renderResults();announcement.textContent=candidates.length?'Select a service from the results, then click Create.':'No matching service found. Try a different search.';return;}
      window.AtixEstimate.start(template.id,template.name);
      location.href='project.html?embed=1&project='+encodeURIComponent(window.AtixEstimate.activeId)+'&template='+encodeURIComponent(template.name)+'&templateId='+template.id;
    });
    input.addEventListener('focus', renderResults); input.addEventListener('input',()=>{selectedTemplate=null;renderResults();});
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); if (results.hidden) renderResults(); moveActive(1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); if (results.hidden) renderResults(); moveActive(-1); }
      else if (event.key === 'Enter' && activeIndex >= 0) { event.preventDefault(); selectTemplate(matches[activeIndex]); }
      else if (event.key === 'Escape') closeResults();
    });
    document.querySelectorAll('.quick-filter').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.quick-filter').forEach(item => item.classList.remove('active')); button.classList.add('active');
      selectedTemplate=null;input.value = button.dataset.query; input.focus(); renderResults();
    }));
    document.addEventListener('click', event => { if (!form.contains(event.target)) closeResults(); });

  }

  initTemplateSearch();
})();
