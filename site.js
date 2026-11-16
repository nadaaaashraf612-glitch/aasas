/* ASAS OMRANIA — explicit state, progressive enhancement */
(() => {
  'use strict';
  const one=(s,r=document)=>r.querySelector(s),all=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const state={lang:'ar',slide:0};
  const SEARCH_HISTORY_KEY='asas-search-history-v1',SEARCH_HISTORY_LIMIT=6;
  let recentSearches=[];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const pages=[['asas-omrania-website.html','الرئيسية','Home'],['about-us.html','من نحن · قصتنا · الرؤية والرسالة · القيادة','About us · Our story · Vision · Leadership'],['services.html','الخدمات · التصميم · الإشراف · التخطيط','Services · Design · Supervision · Planning'],['projects.html','المشاريع · العمارة · التصميم الداخلي','Projects · Architecture · Interiors'],['news.html','الأخبار والمقالات','News & insights'],['team.html','فريقنا','Our team'],['clients.html','عملاؤنا','Our clients'],['careers.html','الوظائف والتقديم','Careers & applications'],['contact.html','تواصل معنا','Contact us']];
  const services={"architecture":["التصميم المعماري","Architectural design","architecture-engineering","عمارة تبدأ بالإنسان والمكان.","Architecture begins with people and place."],"interior":["التصميم الداخلي","Interior design","architecture-interior","تفاصيل تصنع تجربة المكان.","Details that shape the experience."],"supervision":["الإشراف الهندسي","Engineering supervision","architecture-construction","وضوح يرافق مراحل التنفيذ.","Clarity throughout construction."],"planning":["التخطيط العمراني","Urban planning","architecture-urban","نقرأ المكان على مقياس أوسع.","Understanding place at a wider scale."],"structural":["التصميم الإنشائي","Structural design","architecture-detail","من الفكرة إلى نظام إنشائي متكامل.","From concept to a coordinated structure."],"management":["إدارة المشاريع","Project management","architecture-studio","رؤية واضحة لكل خطوة.","A clear view of every step."]};
  const projects={"villa":["مسكن الفناء","Courtyard residence","architecture-villa","عمارة سكنية","Residential architecture"],"urban":["مسارات خضراء","Green connections","architecture-urban","تخطيط حضري","Urban landscape"],"residential":["مجتمع متكامل","Connected community","architecture-residential","تطوير سكني","Residential development"],"interior":["مساحات للعمل","Spaces for work","architecture-interior","تصميم داخلي","Interior design"],"lobby":["بهو الضوء","Light-filled lobby","architecture-atrium","تصميم داخلي","Interior design"],"plaza":["ساحة التواصل","Community plaza","architecture-urban-alt","تصميم حضري","Urban design"],"business":["مركز الأعمال","Business centre","architecture-engineering","عمارة أعمال","Business architecture"],"garden":["مسكن الحديقة","Garden residence","courtyard-residence-exterior","عمارة سكنية","Residential architecture"]};
  const articles={facade:['الواجهة ليست مجرد مظهر.','More than a facade.','architecture-facade','الضوء والظل والمواد.','Light, shade and materials.'],detail:['حين تصنع التفاصيل الفارق.','When details make the difference.','architecture-detail','التنسيق الذي يحمي الفكرة.','Coordination that protects the idea.'],landscape:['المكان يبدأ من الإنسان.','Places begin with people.','architecture-urban-alt','المسارات والمساحات المفتوحة.','Walkways and open spaces.'],daylight:["الضوء الطبيعي يصنع الفرق.","Daylight makes the difference.","architecture-atrium","كيف يوجّه الضوء قرارات التصميم؟","How does light guide design decisions?"],coordination:["التنسيق يبدأ قبل التنفيذ.","Coordination starts before construction.","architecture-studio","لماذا نراجع التخصصات معًا؟","Why review disciplines together?"],walkability:["مدينة تُكتشف سيرًا على الأقدام.","A city explored on foot.","architecture-urban","ما الذي يجعل المسار قابلًا للمشي؟","What makes a route walkable?"]};
  const searchTypeLabels={service:['خدمة','Service'],project:['مشروع','Project'],article:['مقال','Article'],page:['صفحة','Page']};
  const projectYears={"villa":"2026","urban":"2025","residential":"2026","interior":"2025","lobby":"2026","plaza":"2025","business":"2026","garden":"2025"};
  const articleDates={facade:'2026-11-01',detail:'2026-10-24',landscape:'2026-10-18',daylight:'2026-10-12',coordination:'2026-10-07',walkability:'2026-10-01'};
  const searchKeywords={service:{architecture:'تصميم معماري عمارة واجهات تصميم مباني architecture architectural facades buildings',interior:'تصميم داخلي ديكور فراغات اثاث interior interiors furniture',supervision:'إشراف هندسي موقع تنفيذ بناء supervision construction site',planning:'تخطيط عمراني حضري مدن مسارات planning urban landscape'},project:{villa:'فيلا مسكن فناء سكن عمارة سكنية courtyard villa residential',urban:'مسارات خضراء تخطيط حضري حدائق تنسيق landscape paths green',residential:'مجتمع متكامل تطوير سكني إسكان residential housing community',interior:'مساحات للعمل مكتب مكاتب تصميم داخلي office workspace interior'},article:{facade:'واجهة واجهات حجر زجاج ضوء ظل مواد facade facades stone glass light shadow',detail:'تفاصيل تنسيق معمارية مواد details coordination materials',landscape:'مكان إنسان مسارات مساحات مفتوحة landscape people walkways spaces'}};
  const searchIndex=[
    ...Object.entries(services).map(([id,data])=>({type:'service',href:'service-'+id+'.html',title:[data[0],data[1]],description:[data[3],data[4]],keywords:id+' خدمة خدمات استشارات هندسية service services engineering consulting '+(searchKeywords.service[id]||data[0]+' '+data[1]),date:''})),
    ...Object.entries(projects).map(([id,data])=>({type:'project',href:'project-details.html?project='+id,title:[data[0],data[1]],description:[data[3],data[4]],keywords:id+' مشروع مشاريع '+projectYears[id]+' project projects '+(searchKeywords.project[id]||data[0]+' '+data[1]+' '+data[3]+' '+data[4]),date:projectYears[id]})),
    ...Object.entries(articles).map(([id,data])=>({type:'article',href:'news-details.html?article='+id,title:[data[0],data[1]],description:[data[3],data[4]],keywords:id+' مقال مقالات أخبار رؤى معمارية article articles news insights architecture '+(searchKeywords.article[id]||data[0]+' '+data[1]+' '+data[3]+' '+data[4]),date:articleDates[id]||''})),
    ...pages.map(([href,ar,en])=>({type:'page',href,title:[ar.split(' · ')[0],en.split(' · ')[0]],description:[ar,en],keywords:ar+' '+en,date:''}))
  ];
  function localized(el,ar,en){if(!el)return;el.dataset.ar=ar;el.dataset.en=en;el.textContent=state.lang==='ar'?ar:en;}
  function applyLanguage(lang){
    state.lang=lang==='en'?'en':'ar';document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';
    all('[data-ar][data-en]').forEach(el=>{const value=el.dataset[state.lang];if(el.textContent!==value)el.textContent=value;});
    all('[data-placeholder-ar]').forEach(el=>el.placeholder=el.getAttribute('data-placeholder-'+state.lang));
    all('[data-label-ar]').forEach(el=>el.setAttribute('aria-label',el.getAttribute('data-label-'+state.lang)));
    all('[data-lang]').forEach(el=>{el.textContent=state.lang==='ar'?'EN':'عربي';el.setAttribute('aria-label',state.lang==='ar'?'Switch to English':'التبديل إلى العربية');});
    const titles={'asas-omrania-website.html':['الرئيسية','Home'],'about-us.html':['من نحن','About us'],'services.html':['الخدمات','Services'],'projects.html':['المشاريع','Projects'],'news.html':['الأخبار','Insights'],'team.html':['فريقنا','Our team'],'clients.html':['عملاؤنا','Our clients'],'contact.html':['تواصل معنا','Contact us'],'careers.html':['الوظائف','Careers'],'privacy.html':['سياسة الخصوصية','Privacy policy'],'terms.html':['الشروط والأحكام','Terms & conditions']};
    const file=location.pathname.split('/').pop(),pair=titles[file];if(pair)document.title=pair[state.lang==='ar'?0:1]+' | ASAS OMRANIA';else if(one('.company-hero h1,.page-hero h1'))document.title=one('.company-hero h1,.page-hero h1').textContent+' | ASAS OMRANIA';
    const labels=[['.nav','التنقل الرئيسي','Main navigation'],['[data-slide-prev]','الشريحة السابقة','Previous slide'],['[data-slide-next]','الشريحة التالية','Next slide'],['#site-search','ابحث في الموقع','Search the website'],['.client-marquee','مساحات شعارات العملاء','Client logo spaces'],['[data-share]','مشاركة الرابط','Share link']];labels.forEach(([selector,ar,en])=>all(selector).forEach(el=>el.setAttribute('aria-label',state.lang==='ar'?ar:en)));all('[data-close-dialog]').forEach(el=>el.setAttribute('aria-label',state.lang==='ar'?'إغلاق':'Close'));
    all('img').forEach(image=>{if(!image.dataset.altAr)image.dataset.altAr=image.alt;image.alt=state.lang==='ar'?image.dataset.altAr:(image.src.includes('logo-')?'ASAS OMRANIA':image.src.includes('leader-')?'Illustrative engineering team portrait':'Generated contemporary architectural image');});
    try{localStorage.setItem('asas-lang',state.lang);}catch{}
    renderSearch(one('#site-search')?.value||'');
    document.dispatchEvent(new Event('asas:languagechange'));
  }
  function openDialog(dialog){if(!dialog||dialog.open)return;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');}
  function closeDialog(dialog){if(!dialog)return;if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}
  function setupNavigation(){
    const menu=one('[data-menu]'),nav=one('.nav');
    function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
    menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',state.lang==='ar'?(open?'إغلاق القائمة':'فتح القائمة'):(open?'Close menu':'Open menu'));});
    all('a',nav||document.createElement('div')).forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
    document.addEventListener('click',e=>{if(!e.target.closest('.site-header')){closeMenu();}});
    one('[data-lang]')?.addEventListener('click',()=>applyLanguage(state.lang==='ar'?'en':'ar'));
    all('[data-close-dialog]').forEach(btn=>btn.addEventListener('click',()=>closeDialog(btn.closest('dialog'))));
    all('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.x||e.clientX>r.x+r.width||e.clientY<r.y||e.clientY>r.y+r.height)closeDialog(dialog);}}));
    all('[data-social]').forEach(b=>b.addEventListener('click',()=>openDialog(one('#info-dialog'))));
  }
  function normalize(value){return value.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/[\u064B-\u065F]/g,'').trim();}
  function normalizeSearch(value){return normalize(String(value).normalize('NFKD')).replace(/\u0640/g,'').replace(/[ة]/g,'ه').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').replace(/(^|\s)ال(?=[\u0621-\u064A]{3})/g,'$1').trim();}
  function searchRecords(query){
    const key=normalizeSearch(query.slice(0,160)),terms=[...new Set(key.split(' ').filter(Boolean))];
    const results=searchIndex.map(record=>{
      const title=normalizeSearch(record.title.join(' ')),description=normalizeSearch(record.description.join(' ')),text=title+' '+description+' '+normalizeSearch(record.keywords+' '+record.date);
      const matches=!key||terms.every(term=>text.includes(term));
      let score=0;if(key&&matches){if(record.title.some(value=>normalizeSearch(value)===key))score+=120;if(title.includes(key))score+=60;for(const term of terms){if(title.includes(term))score+=20;if(description.includes(term))score+=6;if(text.includes(term))score+=1;}}
      return {...record,score,matches};
    }).filter(record=>record.matches);
    const nameCompare=(a,b)=>a.title[state.lang==='ar'?0:1].localeCompare(b.title[state.lang==='ar'?0:1],state.lang);
    results.sort((a,b)=>b.score-a.score||nameCompare(a,b));
    return results;
  }
  function appendSearchText(element,value,terms){
    value.split(/(\s+)/).forEach(part=>{if(terms.some(term=>normalizeSearch(part).includes(term))&&part.trim()){const mark=document.createElement('mark');mark.textContent=part;element.append(mark);}else element.append(document.createTextNode(part));});
  }
  function readRecentSearches(){
    try{const values=JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)||'[]');if(!Array.isArray(values))return[];const seen=new Set();return values.filter(value=>typeof value==='string').map(value=>value.trim().slice(0,160)).filter(value=>{const key=normalizeSearch(value);if(!key||seen.has(key))return false;seen.add(key);return true;}).slice(0,SEARCH_HISTORY_LIMIT);}catch{return[];}
  }
  function renderRecentSearches(){
    const list=one('[data-recent-list]');if(!list)return;list.replaceChildren();
    recentSearches.forEach((query,index)=>{const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='site-search__recent-query';button.dataset.recentQuery=query;button.dataset.odId='recent-query-'+index;button.dir='auto';button.title=query;button.textContent=query;item.append(button);list.append(item);});
    const empty=one('[data-recent-empty]'),clear=one('[data-clear-recent]');if(empty)empty.hidden=recentSearches.length>0;if(clear)clear.hidden=recentSearches.length===0;
  }
  function rememberSearch(value){
    const query=value.trim().slice(0,160),key=normalizeSearch(query);if(!key)return;
    recentSearches=[query,...recentSearches.filter(item=>normalizeSearch(item)!==key)].slice(0,SEARCH_HISTORY_LIMIT);
    try{localStorage.setItem(SEARCH_HISTORY_KEY,JSON.stringify(recentSearches));}catch{}
    renderRecentSearches();
  }
  function renderSearch(query){
    const box=one('.search-results');if(!box)return;box.replaceChildren();
    renderRecentSearches();
    const status=one('#search-status'),hasQuery=Boolean(normalizeSearch(query));
    box.hidden=!hasQuery;const summary=one('.site-search__summary');if(summary)summary.hidden=!hasQuery;
    if(!hasQuery){if(status)status.textContent='';return;}
    const results=searchRecords(query),langIndex=state.lang==='ar'?0:1,terms=normalizeSearch(query).split(' ').filter(Boolean);
    if(status){const count=new Intl.NumberFormat(state.lang).format(results.length);status.textContent=state.lang==='ar'?count+' نتيجة'+(query.trim()?' للبحث «'+query.trim()+'»':''):count+(results.length===1?' result':' results')+(query.trim()?' for “'+query.trim()+'”':'');}
    if(!results.length){const message=document.createElement('p');message.className='site-search__empty';message.textContent=state.lang==='ar'?'لم نعثر على نتائج. جرّب اسم خدمة أو مشروع أو موضوع مقال آخر.':'No results found. Try another service, project or article keyword.';box.append(message);return;}
    results.forEach(record=>{
      const link=document.createElement('a');link.href=record.href;link.className='search-result';link.dataset.odId='search-result-'+record.type+'-'+record.href.replace(/[^a-z0-9]+/g,'-');
      const content=document.createElement('span'),meta=document.createElement('span'),typeLabel=document.createElement('span');meta.className='search-result__meta';typeLabel.className='search-result__type';typeLabel.textContent=searchTypeLabels[record.type][langIndex];meta.append(typeLabel);
      if(record.date){const date=document.createElement('time');date.dateTime=record.date;date.textContent=record.date.length===4?new Intl.NumberFormat(state.lang,{useGrouping:false}).format(Number(record.date)):new Intl.DateTimeFormat(state.lang,{year:'numeric',month:'long',day:'numeric'}).format(new Date(record.date+'T12:00:00Z'));meta.append(date);}
      const title=document.createElement('span');title.className='search-result__title';appendSearchText(title,record.title[langIndex],terms);
      const description=document.createElement('span');description.className='search-result__description';appendSearchText(description,record.description[langIndex],terms);
      const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS('http://www.w3.org/2000/svg','path');arrow.setAttribute('viewBox','0 0 24 24');arrow.setAttribute('class','arrow');arrow.setAttribute('aria-hidden','true');path.setAttribute('d','M19 12H5m6-6-6 6 6 6');arrow.append(path);content.append(meta,title,description);link.append(content,arrow);box.append(link);
    });
  }
  function setupSearch(){
    const input=one('#site-search'),form=one('[data-advanced-search]'),dialog=one('#search-dialog');if(!input||!form||!dialog)return;
    recentSearches=readRecentSearches();
    const triggers=all('[data-search]');
    function activateSearch(event){event?.preventDefault();one('.nav')?.classList.remove('open');one('[data-menu]')?.setAttribute('aria-expanded','false');renderSearch(input.value);openDialog(dialog);input.focus({preventScroll:true});}
    triggers.forEach(trigger=>trigger.addEventListener('click',activateSearch));
    dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeDialog(dialog);triggers[0]?.focus({preventScroll:true});}});
    renderSearch(input.value);
    input.addEventListener('input',()=>renderSearch(input.value));
    form.addEventListener('submit',event=>{event.preventDefault();rememberSearch(input.value);renderSearch(input.value);one('.search-result')?.focus();});
    form.addEventListener('reset',()=>{input.value='';renderSearch('');input.focus();});
    one('[data-recent-list]')?.addEventListener('click',event=>{const button=event.target.closest('[data-recent-query]');if(!button)return;input.value=button.dataset.recentQuery;rememberSearch(input.value);renderSearch(input.value);input.focus({preventScroll:true});});
    one('[data-clear-recent]')?.addEventListener('click',()=>{recentSearches=[];try{localStorage.removeItem(SEARCH_HISTORY_KEY);}catch{}renderRecentSearches();input.focus({preventScroll:true});});
    one('.search-results')?.addEventListener('click',event=>{if(event.target.closest('.search-result'))rememberSearch(input.value);});
    window.addEventListener('storage',event=>{if(event.key===SEARCH_HISTORY_KEY||event.key===null){recentSearches=readRecentSearches();renderRecentSearches();}});
    input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();one('.search-result')?.focus();}});
    one('.search-results')?.addEventListener('keydown',event=>{if(event.key!=='ArrowDown'&&event.key!=='ArrowUp')return;const links=all('.search-result'),index=links.indexOf(event.target.closest('.search-result'));if(index<0)return;event.preventDefault();if(index===0&&event.key==='ArrowUp')input.focus();else links[(index+(event.key==='ArrowDown'?1:-1)+links.length)%links.length]?.focus();});
    document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k')activateSearch(event);});
  }
  function setupFilters(){
    all('[data-filter-grid]').forEach(grid=>{
      const root=grid.parentElement,buttons=all('[data-filter]',root),input=one('[data-content-search]',root),year=one('[data-year-filter]',root),sector=one('[data-sector-filter]',root);let category='all';
      function filter(){let count=0;const query=normalize(input?.value||'');all('[data-category]',grid).forEach(card=>{const visible=(category==='all'||card.dataset.category===category)&&(!query||normalize(card.dataset.searchText||card.textContent).includes(query))&&(!year||year.value==='all'||year.value===card.dataset.year)&&(!sector||sector.value==='all'||sector.value===card.dataset.sector);card.hidden=!visible;if(visible)count++;});const empty=one('[data-empty]',grid);if(empty)empty.hidden=count!==0;}
      buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;buttons.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});filter();}));
      input?.addEventListener('input',filter);year?.addEventListener('change',filter);sector?.addEventListener('change',filter);input?.closest('form')?.addEventListener('submit',e=>e.preventDefault());
    });
  }
  function setupSlider(){
    const hero=one('.hero'),slides=all('.hero-slide');if(!hero||slides.length<2)return;
    const interval=parseFloat(getComputedStyle(hero).getPropertyValue('--hero-slide-delay'))||5000;
    let timer=null,focused=false,visible=true;
    function show(i){state.slide=(i+slides.length)%slides.length;slides.forEach((slide,n)=>{slide.classList.toggle('active',n===state.slide);slide.setAttribute('aria-hidden',String(n!==state.slide));});all('.slide-dot').forEach((dot,n)=>dot.classList.toggle('active',n===state.slide));}
    function schedule(){clearTimeout(timer);timer=null;const paused=reduced.matches||document.hidden||focused||!visible||Boolean(one('dialog[open]'));hero.classList.toggle('is-paused',paused);if(paused)return;timer=setTimeout(()=>{show(state.slide+1);schedule();},interval);}
    function step(delta){show(state.slide+delta);schedule();}
    one('[data-slide-next]')?.addEventListener('click',()=>step(1));
    one('[data-slide-prev]')?.addEventListener('click',()=>step(-1));
    hero.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const forward=event.key===(state.lang==='ar'?'ArrowLeft':'ArrowRight');step(forward?1:-1);}});
    hero.addEventListener('focusin',()=>{focused=true;schedule();});
    hero.addEventListener('focusout',event=>{focused=hero.contains(event.relatedTarget);schedule();});
    document.addEventListener('visibilitychange',schedule);
    reduced.addEventListener?.('change',schedule);
    all('dialog').forEach(dialog=>{dialog.addEventListener('toggle',schedule);dialog.addEventListener('close',schedule);});
    if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});observer.observe(hero);}
    show(state.slide);schedule();
  }
  function setupCarousels(){
    all('[data-carousel]').forEach(root=>{
      const track=one('[data-carousel-track]',root),cards=Array.from(track.children),pages=all('[data-carousel-page]',root);
      const controls=one('.content-carousel__controls',root),delay=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--carousel-delay'))||6000;
      let positions=[0],index=0,timer=null,scrollFrame=0,visible=!('IntersectionObserver'in window),hovered=false,focused=false,interacted=false,drag=null,suppressClickUntil=0;
      let looping=false,loopJob=null,loopTimer=null,loopFrame=0,measuredWidth=-1;
      const rtl=()=>document.documentElement.dir==='rtl';
      function render(){
        pages.forEach((button,i)=>{if(button.hidden!==(i>=positions.length))button.hidden=i>=positions.length;const current=String(i===index);if(button.getAttribute('aria-current')!==current)button.setAttribute('aria-current',current);});
        if(controls.hidden!==(positions.length<2))controls.hidden=positions.length<2;
      }
      function schedule(){
        clearTimeout(timer);timer=null;
        if(!visible||hovered||focused||interacted||reduced.matches||document.hidden||positions.length<2||one('dialog[open]'))return;
        timer=setTimeout(()=>{move(index+1,false);},delay);
      }
      function instantScroll(left){if(typeof track.scrollTo==='function')track.scrollTo({left,behavior:'instant'});else track.scrollLeft=left;}
      function finishLoop(){
        if(!loopJob)return;const job=loopJob;loopJob=null;
        clearTimeout(loopTimer);cancelAnimationFrame(loopFrame);loopFrame=0;
        if(job.forward)track.append(job.card);else track.prepend(job.card);
        job.clone.remove();instantScroll(0);
      }
      function rotate(forward){
        const card=forward?track.firstElementChild:track.lastElementChild,clone=card.cloneNode(true);
        [clone,...all('[data-od-id],[id]',clone)].forEach(element=>{element.removeAttribute('data-od-id');element.removeAttribute('id');});
        clone.setAttribute('aria-hidden','true');clone.setAttribute('inert','');
        const gap=parseFloat(getComputedStyle(track).columnGap)||0,step=card.getBoundingClientRect().width+gap;
        const target=forward?step*(rtl()?-1:1):0;
        loopJob={card,clone,forward,target};
        if(forward)track.append(clone);else{track.prepend(clone);instantScroll(step*(rtl()?-1:1));}
        if(reduced.matches){finishLoop();return;}
        loopFrame=requestAnimationFrame(()=>{loopFrame=0;if(!loopJob)return;if(typeof track.scrollTo==='function')track.scrollTo({left:target,behavior:'smooth'});else{track.scrollLeft=target;finishLoop();}});
        loopTimer=setTimeout(finishLoop,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--entrance-duration'))||850);
      }
      function move(next,manual=true){
        if(manual)interacted=true;
        finishLoop();
        const nextIndex=(next+positions.length)%positions.length;
        if(looping){
          let delta=(nextIndex-index+positions.length)%positions.length;if(delta>positions.length/2)delta-=positions.length;
          index=nextIndex;if(delta)rotate(delta>0);render();schedule();return;
        }
        index=nextIndex;
        const left=positions[index]*(rtl()?-1:1),behavior=reduced.matches?'instant':'smooth';
        if(typeof track.scrollTo==='function')track.scrollTo({left,behavior});else track.scrollLeft=left;
        render();schedule();
      }
      function measure(reset=false){
        const width=track.clientWidth;if(!reset&&width===measuredWidth)return;measuredWidth=width;
        finishLoop();
        if(cards.some((card,i)=>track.children[i]!==card))cards.forEach(card=>track.append(card));
        index=0;
        const maximum=Math.max(0,track.scrollWidth-track.clientWidth),gap=parseFloat(getComputedStyle(track).columnGap)||0,step=(cards[0]?.getBoundingClientRect().width||0)+gap;
        looping=width>0&&maximum<2&&cards.length>1;
        if(looping){positions=cards.map((card,i)=>i*step);instantScroll(0);render();schedule();return;}
        const next=[];cards.forEach((card,i)=>{const position=Math.min(i*step,maximum);if(!next.length||position-next[next.length-1]>1)next.push(position);});
        positions=next.length?next:[0];index=Math.min(index,positions.length-1);move(index,false);
      }
      function readScroll(){
        scrollFrame=0;if(looping)return;const offset=Math.abs(track.scrollLeft);
        const nearest=positions.reduce((best,position,i)=>Math.abs(position-offset)<Math.abs(positions[best]-offset)?i:best,0);
        if(nearest!==index){index=nearest;render();}
      }
      function stopAutomatic(){interacted=true;clearTimeout(timer);timer=null;}
      one('[data-carousel-prev]',root).addEventListener('click',()=>move(index-1));
      one('[data-carousel-next]',root).addEventListener('click',()=>move(index+1));
      pages.forEach((button,i)=>button.addEventListener('click',()=>move(i)));
      track.addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(readScroll);},{passive:true});
      track.addEventListener('scrollend',()=>{if(loopJob&&Math.abs(track.scrollLeft-loopJob.target)<2)finishLoop();});
      track.addEventListener('keydown',event=>{
        if(event.target!==track)return;
        if(event.key==='Home'||event.key==='End'){event.preventDefault();move(event.key==='Home'?0:positions.length-1);}
        else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(index+(event.key===(rtl()?'ArrowLeft':'ArrowRight')?1:-1));}
      });
      root.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'){hovered=true;schedule();}});
      root.addEventListener('pointerleave',()=>{hovered=false;schedule();});
      root.addEventListener('focusin',()=>{focused=true;schedule();});
      root.addEventListener('focusout',event=>{focused=root.contains(event.relatedTarget);schedule();});
      track.addEventListener('pointerdown',event=>{
        stopAutomatic();
        if(event.pointerType!=='mouse'||event.button!==0)return;
        drag={id:event.pointerId,x:event.clientX,left:track.scrollLeft,start:index,distance:0,moved:false};
      });
      track.addEventListener('pointermove',event=>{
        if(!drag||event.pointerId!==drag.id)return;
        const distance=event.clientX-drag.x;drag.distance=distance;
        if(!drag.moved&&Math.abs(distance)<8)return;
        if(!drag.moved){drag.moved=true;track.classList.add('is-dragging');track.setPointerCapture?.(drag.id);}
        event.preventDefault();track.scrollLeft=drag.left-distance;
      });
      function endDrag(){
        if(!drag)return;const previous=drag;drag=null;
        track.classList.remove('is-dragging');
        if(track.hasPointerCapture?.(previous.id))track.releasePointerCapture(previous.id);
        if(previous.moved){suppressClickUntil=performance.now()+250;readScroll();const advance=Math.abs(previous.distance)>=Math.min(80,track.clientWidth*.15);const target=advance?Math.max(0,Math.min(positions.length-1,previous.start+(previous.distance*(rtl()?1:-1)>0?1:-1))):index;move(target);}
      }
      track.addEventListener('pointerup',endDrag);track.addEventListener('pointercancel',endDrag);
      track.addEventListener('lostpointercapture',endDrag);
      track.addEventListener('click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopPropagation();}},true);
      track.addEventListener('dragstart',event=>event.preventDefault());
      document.addEventListener('visibilitychange',()=>{if(document.hidden)finishLoop();schedule();});
      all('dialog').forEach(dialog=>{dialog.addEventListener('toggle',schedule);dialog.addEventListener('close',schedule);});
      reduced.addEventListener?.('change',()=>{if(reduced.matches){finishLoop();if(!looping)instantScroll(positions[index]*(rtl()?-1:1));}schedule();});
      document.addEventListener('asas:languagechange',()=>measure(true));
      if('ResizeObserver'in window)new ResizeObserver(()=>measure()).observe(track);else addEventListener('resize',()=>measure(),{passive:true});
      if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.25;schedule();},{threshold:.25}).observe(root);
      addEventListener('pagehide',()=>{clearTimeout(timer);cancelAnimationFrame(scrollFrame);finishLoop();});
      addEventListener('pageshow',schedule);
      root.classList.add('is-enhanced');measure();
    });
  }
  function setupEntrances(){
    const home=one('[data-home-motion]');if(!home||typeof home.animate!=='function')return;
    const tokens=getComputedStyle(document.documentElement),duration=parseFloat(tokens.getPropertyValue('--entrance-duration'))||850,shift=parseFloat(tokens.getPropertyValue('--entrance-shift'))||32,stagger=parseFloat(tokens.getPropertyValue('--entrance-stagger'))||110,easing=tokens.getPropertyValue('--ease').trim()||'ease-out';
    const played=new WeakSet(),running=new Set();
    function enter(element,delay=0){
      if(played.has(element))return;played.add(element);
      if(reduced.matches)return;
      const image=element.tagName==='IMG',inset=element.matches('.project-card__info,.service-card__info,.news-card__body');
      const distance=element.matches('.content-carousel--articles .news-card__body')?Math.min(shift,parseFloat(tokens.getPropertyValue('--s2'))||8):shift;
      const frames=image?[{transform:'scale(1.12)'},{transform:'scale(1)'}]:[{transform:'translateY('+(inset?-distance:distance)+'px)'},{transform:'translateY(0)'}];
      const animation=element.animate(frames,{duration,delay,easing,fill:'backwards'});
      running.add(animation);animation.onfinish=animation.oncancel=()=>running.delete(animation);
    }
    all('.hero-copy>.eyebrow,.hero-copy h1,.hero-copy>.copy,.hero-actions',home).forEach((element,i)=>enter(element,i*stagger));
    const targets=all('.section-head>div,.section-head>.copy,.about-content,.about-visual,.project-card>img,.project-card__info,.content-carousel__track img,.content-carousel__track .service-card__info,.content-carousel__track .news-card__body,.clients-head,.section-action',home);
    if('IntersectionObserver'in window){
      const observer=new IntersectionObserver(entries=>{let order=0;entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);enter(entry.target,Math.min(order++,2)*stagger);});},{threshold:.12,rootMargin:'0px 0px -24px 0px'});
      targets.forEach(element=>observer.observe(element));
    }
    reduced.addEventListener?.('change',()=>{if(reduced.matches){running.forEach(animation=>animation.cancel());running.clear();}});
    addEventListener('pagehide',()=>{running.forEach(animation=>animation.cancel());running.clear();});
  }
  function setupServiceJourney(){
    const journeys=all('[data-service-journey]');if(!journeys.length)return;
    const running=new Set(),played=new WeakSet();let observer=null;
    function animate(element,frames,options){if(typeof element.animate!=='function')return;const animation=element.animate(frames,options);running.add(animation);animation.onfinish=animation.oncancel=()=>running.delete(animation);}
    function play(root){if(played.has(root))return;played.add(root);if(reduced.matches)return;
      const ease=getComputedStyle(document.documentElement).getPropertyValue('--ease').trim()||'ease-out',mobile=matchMedia('(max-width:767px)').matches;
      all('.service-detail__milestone',root).forEach((node,i)=>animate(node,[{transform:'scale(.92)'},{transform:'scale(1)'}],{duration:400,delay:i*260,easing:ease,fill:'backwards'}));
      all('.service-detail__stage-copy',root).forEach((node,i)=>animate(node,[{transform:'translateY(8px)'},{transform:'translateY(0)'}],{duration:400,delay:i*260,easing:ease,fill:'backwards'}));
      all('.service-detail__connector--'+(mobile?'mobile':'desktop')+' .service-detail__flow',root).forEach((path,i)=>animate(path,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:500,delay:180+i*260,easing:ease,fill:'backwards'}));
    }
    if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);play(entry.target);}}),{threshold:.2});journeys.forEach(root=>observer.observe(root));}else journeys.forEach(play);
    const cancel=()=>{running.forEach(animation=>animation.cancel());running.clear();};
    const onMotionChange=()=>{if(reduced.matches)cancel();};reduced.addEventListener?.('change',onMotionChange);
    addEventListener('pagehide',()=>{observer?.disconnect();cancel();reduced.removeEventListener?.('change',onMotionChange);},{once:true});
  }
  function setupMotion(){
    const hero=one('.hero'),images=all('[data-parallax]');if(!hero&&!images.length)return;
    const wide=window.matchMedia('(min-width: 768px)'),controller=new AbortController();
    const entries=images.map(image=>({element:image,frame:image.parentElement,property:'--media-shift',current:0}));
    if(hero)entries.unshift({element:hero,frame:hero,property:'--parallax',current:0});
    const active=new Set(),style=getComputedStyle(document.documentElement);
    const travel=parseFloat(style.getPropertyValue('--parallax-travel'))||24,heroLimit=parseFloat(style.getPropertyValue('--hero-parallax-limit'))||44;
    let tick=0,previousTime=0,observer=null;
    function write(entry,value){const next=value.toFixed(2)+'px';if(entry.element.style.getPropertyValue(entry.property)!==next)entry.element.style.setProperty(entry.property,next);}
    function request(){if(!tick)tick=requestAnimationFrame(update);}
    function update(time){
      tick=0;const enabled=wide.matches&&!reduced.matches&&!document.hidden;
      if(!enabled){entries.forEach(entry=>{entry.current=0;write(entry,0);});previousTime=0;return;}
      const delta=previousTime?Math.min(time-previousTime,32):16.67,blend=1-Math.pow(.8,delta/16.67);previousTime=time;
      const targets=entries.filter(entry=>active.has(entry.frame)).map(entry=>{
        if(entry.element===hero)return{entry,target:Math.min(Math.max(scrollY,0)*.08,heroLimit)};
        const rect=entry.frame.getBoundingClientRect(),progress=(innerHeight/2-rect.top-rect.height/2)/(innerHeight/2+rect.height/2);
        return{entry,target:Math.max(-1,Math.min(1,progress))*travel};
      });
      let moving=false;
      targets.forEach(({entry,target})=>{const next=entry.current+(target-entry.current)*blend;entry.current=Math.abs(target-next)<.08?target:next;moving=moving||entry.current!==target;write(entry,entry.current);});
      if(moving)request();else previousTime=0;
    }
    if('IntersectionObserver'in window){observer=new IntersectionObserver(records=>{records.forEach(record=>{if(record.isIntersecting)active.add(record.target);else active.delete(record.target);});request();},{rootMargin:'64px 0px'});entries.forEach(entry=>observer.observe(entry.frame));}
    else entries.forEach(entry=>active.add(entry.frame));
    addEventListener('scroll',()=>{if(active.size&&wide.matches&&!reduced.matches&&!document.hidden)request();},{passive:true,signal:controller.signal});
    addEventListener('resize',request,{passive:true,signal:controller.signal});
    document.addEventListener('visibilitychange',request,{signal:controller.signal});
    reduced.addEventListener?.('change',request,{signal:controller.signal});wide.addEventListener?.('change',request,{signal:controller.signal});
    addEventListener('pagehide',event=>{cancelAnimationFrame(tick);tick=0;if(!event.persisted){controller.abort();observer?.disconnect();}},{signal:controller.signal});
    addEventListener('pageshow',request,{signal:controller.signal});request();
  }
  function setupContactPage(){
    const form=one('.contact-page__form');if(!form)return;const status=one('[data-contact-status]'),fields=all('input[name],select[name],textarea[name]',form);let attempted=false;
    function validate(field,reveal){field.setCustomValidity('');let error=null;const value=field.value.trim();if(field.required&&!value)error=['هذا الحقل مطلوب.','This field is required.'];else if(field.type==='email'&&value&&field.validity.typeMismatch)error=['أدخل بريدًا إلكترونيًا صحيحًا.','Enter a valid email address.'];else if(field.name==='message'&&value&&value.length<10)error=['اكتب رسالة من 10 أحرف على الأقل.','Write at least 10 characters.'];else if(field.name==='phone'&&value){const phone=value.replace(/[٠-٩]/g,n=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))),digits=phone.replace(/\D/g,'');if(!/^[+0-9 ().-]+$/.test(phone)||digits.length<7||digits.length>15)error=['أدخل رقم هاتف صحيحًا.','Enter a valid phone number.'];}if(error)field.setCustomValidity(error[state.lang==='ar'?0:1]);if(reveal){const label=field.closest('label'),feedback=one('[data-contact-feedback]',label),neutral=!field.required&&!value;label.classList.toggle('contact-page__field--invalid',!!error);label.classList.toggle('contact-page__field--valid',!error&&!neutral);if(error)field.setAttribute('aria-invalid','true');else field.removeAttribute('aria-invalid');feedback.hidden=neutral;localized(feedback,...(error||['صحيح','Valid']));}return !error;}
    fields.forEach(field=>{field.id='contact-field-'+field.name;const feedback=document.createElement('span');feedback.id='contact-feedback-'+field.name;feedback.className='contact-page__field-feedback';feedback.dataset.contactFeedback='';feedback.hidden=true;field.closest('label').append(feedback);field.setAttribute('aria-describedby',feedback.id);field.addEventListener('blur',()=>{field.dataset.touched='true';validate(field,true);});field.addEventListener('input',()=>{if(field.dataset.touched||attempted)validate(field,true);});field.addEventListener('change',()=>{field.dataset.touched='true';validate(field,true);});});
    document.addEventListener('asas:languagechange',()=>fields.forEach(field=>{if(field.dataset.touched||attempted)validate(field,true);}));
    form.addEventListener('submit',event=>{event.preventDefault();attempted=true;let valid=true;fields.forEach(field=>{if(!validate(field,true))valid=false;});status.hidden=false;status.classList.toggle('is-invalid',!valid);status.setAttribute('role',valid?'status':'alert');if(!valid){localized(status,'راجع الحقول المطلوبة والبيانات المعلّمة أدناه.','Check the required fields and highlighted details below.');status.focus({preventScroll:true});status.scrollIntoView({behavior:'auto',block:'center'});return;}localized(status,'رسالتك جاهزة في تطبيق البريد. راجعها ثم أرسلها إلى فريقنا.','Your email draft is ready. Review it and send it to our team.');const type=form.elements.type.selectedOptions[0].textContent,body=['Name: '+form.elements.name.value,'Email: '+form.elements.email.value,'Phone: '+(form.elements.phone.value?'+966 '+form.elements.phone.value:''),'Enquiry: '+type,'Message: '+form.elements.message.value].join('\n');location.href='mailto:asas@asas-omrania.com?subject='+encodeURIComponent('ASAS OMRANIA — '+type)+'&body='+encodeURIComponent(body);});
    // Keep the native select as the form value and progressively enhance its UI.
    const select=form.elements.type,host=document.createElement('span');host.className='contact-page__select';
    select.after(host);const trigger=document.createElement('button');trigger.type='button';trigger.className='contact-page__select-trigger';trigger.id='contact-enquiry-trigger';trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','contact-enquiry-options');trigger.setAttribute('aria-required','true');trigger.setAttribute('aria-describedby','contact-feedback-type');
    const caption=document.createElement('span');trigger.append(caption);trigger.insertAdjacentHTML('beforeend','<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');host.append(trigger);
    const list=document.createElement('span');list.id='contact-enquiry-options';list.className='contact-page__select-options';list.setAttribute('role','listbox');list.hidden=true;host.append(list);
    const options=Array.from(select.options).filter(option=>option.value).map(option=>{const item=document.createElement('button');item.type='button';item.tabIndex=-1;item.setAttribute('role','option');item.dataset.value=option.value;item.dataset.ar=option.dataset.ar;item.dataset.en=option.dataset.en;item.textContent=option.textContent;list.append(item);item.addEventListener('click',event=>{event.preventDefault();select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));syncSelect();closeSelect();trigger.focus();});return item;});
    select.hidden=true;select.tabIndex=-1;
    function syncSelect(){caption.textContent=select.selectedOptions[0].textContent;trigger.classList.toggle('is-placeholder',!select.value);trigger.setAttribute('aria-label',(state.lang==='ar'?'نوع الاستفسار: ':'Enquiry type: ')+caption.textContent);trigger.setAttribute('aria-invalid',select.getAttribute('aria-invalid')||'false');options.forEach(item=>item.setAttribute('aria-selected',String(item.dataset.value===select.value)));}
    function closeSelect(){list.hidden=true;trigger.setAttribute('aria-expanded','false');}
    function openSelect(index){list.hidden=false;trigger.setAttribute('aria-expanded','true');(options[index]||options.find(item=>item.dataset.value===select.value)||options[0]).focus();}
    trigger.addEventListener('click',event=>{event.preventDefault();list.hidden?openSelect():closeSelect();});
    host.addEventListener('keydown',event=>{const index=options.indexOf(document.activeElement);if(event.key==='Escape'){event.preventDefault();closeSelect();trigger.focus();}else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(list.hidden)openSelect(event.key==='ArrowUp'?options.length-1:undefined);else options[(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length].focus();}else if(event.key==='Home'||event.key==='End'){event.preventDefault();openSelect(event.key==='Home'?0:options.length-1);}else if(event.key==='Tab')closeSelect();});
    document.addEventListener('click',event=>{if(!host.contains(event.target))closeSelect();});
    host.addEventListener('focusout',event=>{if(!host.contains(event.relatedTarget)){closeSelect();select.dataset.touched='true';validate(select,true);syncSelect();}});
    select.addEventListener('change',syncSelect);form.addEventListener('submit',syncSelect);
    function syncContactLanguage(){all('[name="name"],[name="message"]',form).forEach(field=>field.dir=state.lang==='ar'?'rtl':'ltr');syncSelect();}
    document.addEventListener('asas:languagechange',syncContactLanguage);syncContactLanguage();

  }
  function showCareerSubmission(form,success){
    const status=one('[data-form-status]',form.parentElement);if(!status)return;status.hidden=false;status.classList.toggle('is-success',success);status.classList.toggle('is-invalid',!success);status.setAttribute('role',success?'status':'alert');one('[data-career-demo-label]',status).hidden=!success;
    localized(one('[data-career-status-title]',status),success?'تم تقديم طلبك بنجاح':'تعذّر إرسال الطلب: راجع الحقول المطلوبة',success?'Your application was submitted successfully':'Application not submitted: check required fields');
    localized(one('[data-career-status-description]',status),success?'سيتواصل معك فريق التوظيف في أقرب وقت.':'استكمل الحقول المطلوبة وصحّح البيانات المعلّمة أدناه.',success?'Our recruitment team will contact you as soon as possible.':'Complete the required fields and correct the highlighted details below.');
    status.focus({preventScroll:true});status.scrollIntoView({behavior:success&&!reduced.matches?'smooth':'auto',block:'center'});
  }
  function setupForms(){all('[data-email-form]:not(.contact-page__form)').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();if(form.matches('.careers-page__form')){const valid=validateCareerForm(form);showCareerSubmission(form,valid);return;}
    if(!form.reportValidity())return;const data=new FormData(form),status=one('[data-form-status]',form.parentElement);const body=Array.from(data.entries()).filter(([,v])=>typeof v==='string').map(([k,v])=>k+': '+v).join('\n');
    if(status){status.hidden=false;localized(status,'المسودة جاهزة في تطبيق بريدك. راجع الرسالة ثم أرسلها.','Draft ready in your email app. Review it before sending.');}
    location.href='mailto:asas@asas-omrania.com?subject='+encodeURIComponent('ASAS OMRANIA — Project enquiry')+'&body='+encodeURIComponent(body);
  }));}
  function validateCareerField(field,reveal=true){
    const label=field.closest('label'),feedback=one('[data-field-feedback]',label);field.setCustomValidity('');let message=null;
    const missing={name:['اكتب اسمك الكامل.','Enter your full name.'],email:['اكتب بريدك الإلكتروني.','Enter your email address.'],phone:['اكتب رقم هاتفك.','Enter your phone number.'],discipline:['اختر تخصصك.','Select your discipline.'],experience:['أدخل سنوات خبرتك، ويمكن إدخال صفر.','Enter your years of experience; zero is accepted.'],cv:['اختر ملف السيرة الذاتية.','Choose your CV file.']};
    if(field.required&&!field.value.trim())message=missing[field.name]||['هذا الحقل مطلوب.','This field is required.'];
    if(field.name==='name'&&field.value&&!field.value.trim())message=missing.name;
    if(field.name==='phone'&&field.value){const value=field.value.replace(/[٠-٩]/g,n=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))).replace(/[۰-۹]/g,n=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n))),digits=value.replace(/\D/g,'');if(!/^[+0-9 ().-]+$/.test(value)||digits.length<7||digits.length>15)message=['أدخل رقم هاتف صحيحًا من 7 إلى 15 رقمًا.','Enter a valid phone number with 7–15 digits.'];}
    if(field.name==='cv'&&field.files?.[0]){const file=field.files[0];if(!file.name.toLowerCase().endsWith('.pdf')||file.size>5*1024*1024)message=['اختر ملف PDF لا يتجاوز 5 ميجابايت.','Choose a PDF file no larger than 5 MB.'];}
    if(!message&&!field.validity.valid){if(field.validity.typeMismatch)message=field.type==='email'?['أدخل بريدًا إلكترونيًا صحيحًا.','Enter a valid email address.']:['أدخل رابطًا صحيحًا يبدأ بـ https:// أو http://.','Enter a valid URL starting with https:// or http://.'];else if(field.name==='experience')message=['أدخل عددًا صحيحًا بين 0 و60.','Enter a whole number between 0 and 60.'];else message=['راجع البيانات المدخلة.','Check the value you entered.'];}
    if(message)field.setCustomValidity(message[state.lang==='ar'?0:1]);
    if(reveal){const neutral=!field.required&&!field.value;label.classList.toggle('career-field--invalid',Boolean(message));label.classList.toggle('career-field--valid',!message&&!neutral);if(message)field.setAttribute('aria-invalid','true');else field.removeAttribute('aria-invalid');if(feedback){feedback.hidden=neutral;localized(feedback,...(message||['صحيح','Valid']));}}
    return !message;
  }
  function validateCareerForm(form){let first=null;all('input[name],select[name],textarea[name]',form).forEach(field=>{field.dataset.touched='true';if(!validateCareerField(field)&&!first)first=field;});if(first){first.focus();return false;}return true;}
  function setupCareerValidation(){const form=one('.careers-page__form');if(!form)return;form.noValidate=true;const fields=all('input[name],select[name],textarea[name]',form);fields.forEach(field=>{field.id=field.id||'career-field-'+field.name;const feedback=document.createElement('span');feedback.id='career-feedback-'+field.name;feedback.className='career-field-feedback';feedback.dataset.fieldFeedback='';feedback.hidden=true;field.closest('label').append(feedback);field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),feedback.id].filter(Boolean).join(' '));field.addEventListener('blur',()=>{field.dataset.touched='true';validateCareerField(field);});field.addEventListener('input',()=>{if(field.dataset.touched)validateCareerField(field);});field.addEventListener('change',()=>{field.dataset.touched='true';validateCareerField(field);});});document.addEventListener('asas:languagechange',()=>fields.forEach(field=>{if(field.dataset.touched)validateCareerField(field);}));form.addEventListener('reset',()=>setTimeout(()=>fields.forEach(field=>{delete field.dataset.touched;field.setCustomValidity('');field.removeAttribute('aria-invalid');field.closest('label').classList.remove('career-field--invalid','career-field--valid');one('[data-field-feedback]',field.closest('label')).hidden=true;}),0));}
  function setupCareerFile(){const input=one('.careers-page input[name=cv]'),name=one('[data-cv-name]');if(!input||!name)return;input.addEventListener('change',()=>{const file=input.files?.[0];name.textContent=file?file.name:'';});}
  function setupCareerJobs(){
    const form=one('.careers-page__form');if(!form)return;const discipline=one('select[name="discipline"]',form);if(!discipline)return;
    all('[data-apply-job]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();form.dataset.selectedJob=link.dataset.applyJob;discipline.value=link.dataset.jobDiscipline;discipline.dispatchEvent(new Event('change',{bubbles:true}));const status=one('[data-form-status]',form.parentElement);if(status)status.hidden=true;discipline.focus({preventScroll:true});form.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});}));
    form.addEventListener('reset',()=>{delete form.dataset.selectedJob;});
  }
  function updateImage(image,name){if(!image)return;const stem='assets/'+name;image.src=stem+'-960.webp';image.srcset=stem+'-640.webp 640w, '+stem+'-960.webp 960w';image.sizes='(max-width: 767px) 100vw, 60vw';}
  function setupDetails(){const params=new URLSearchParams(location.search),file=location.pathname.split('/').pop();
    if(file==='service-details.html'&&params.has('service')&&services[params.get('service')]){location.replace('service-'+params.get('service')+'.html');}
    if(file==='project-details.html'){
      const id=Object.hasOwn(projects,params.get('project'))?params.get('project'):'villa',data=projects[id];
      const narratives={
        villa:['بيت ينفتح على الداخل.','A home that opens inward.','توازن بين الانفتاح على الضوء والحفاظ على الخصوصية. يربط الفناء المساحات الداخلية بالطبيعة، بينما تمنح الكتل الحجرية المبنى حضوره الهادئ.','A balance between daylight and privacy. The courtyard connects interior spaces with nature, while stone volumes give the building a quiet presence.','courtyard-residence-exterior','courtyard-residence-interior'],
        urban:['الطبيعة تصل بين الأماكن.','Nature connects places.','تستكشف الفكرة كيف تتحول المساحات الخضراء إلى شبكة للحركة واللقاء. تتقاطع المسارات مع مناطق الاستراحة لتخلق علاقة متصلة بين الإنسان والمشهد الحضري.','Green space becomes a network for movement and gathering. Walkways meet places to pause, connecting people with the urban landscape.','architecture-urban','architecture-urban-alt'],
        residential:['مساحة للحياة المشتركة.','Room for shared life.','تصور سكني يقرأ العلاقة بين المباني والمساحات المشتركة. تتدرج الحركة من المسارات العامة إلى المداخل الخاصة، وتمنح الخضرة الفراغات البينية دورًا في الحياة اليومية.','A residential concept exploring buildings and shared space. Routes transition from public paths to private entrances, while greenery gives the spaces between buildings an everyday role.','architecture-residential','courtyard-residence-exterior'],
        interior:['العمل يبدأ بمكان متوازن.','Better spaces for work.','تستكشف المساحات الداخلية التوازن بين التركيز والتواصل. يجمع التصور بين مناطق عمل واضحة ومساحات للقاء، مع توظيف الضوء والمواد لمنح الداخل إيقاعًا هادئًا.','These interiors balance focus and connection. Defined work areas meet shared spaces, with light and materials giving the interior a calm rhythm.','architecture-interior','architecture-studio'],
        lobby:['الضوء يصنع الانطباع الأول.','Light shapes the first impression.','بهو يربط بين الوصول والحركة داخل المبنى. يمنح الارتفاع والضوء الطبيعي المساحة حضورها، بينما توضح العلاقات البصرية اتجاهات الحركة ومناطق الاستقبال.','A lobby connects arrival with movement through the building. Height and daylight shape its presence, while visual connections clarify routes and reception areas.','architecture-atrium','architecture-interior'],
        plaza:['مكان يجمع الناس.','A place to come together.','ساحة مفتوحة تستكشف دور الفراغ العام في التواصل. تتكامل مسارات المشاة ومناطق الجلوس والمسطحات الخضراء لتتيح أنماطًا مختلفة من الحركة والتوقف واللقاء.','An open plaza explores the role of public space in connection. Pedestrian routes, seating and greenery offer different ways to move, pause and meet.','architecture-urban-alt','architecture-urban'],
        business:['حضور واضح، ومساحات مرنة.','A clear presence. Flexible spaces.','تصور معماري لمبنى أعمال يجمع بين وضوح الكتلة ومرونة الاستخدام. تدرس الواجهات العلاقة بين الإضاءة والخصوصية، وتمنح المداخل وتسلسل الحركة تجربة وصول واضحة.','A business building concept combines a clear architectural volume with flexible use. Facades explore daylight and privacy, while entrances and circulation create a legible arrival.','architecture-engineering','architecture-facade'],
        garden:['الحديقة امتداد للبيت.','The garden extends the home.','مسكن يستكشف العلاقة اليومية بالطبيعة. تفتح المساحات المشتركة على الحديقة، وتساعد الكتل والفتحات على تحقيق توازن بين التواصل مع الخارج وخصوصية الداخل.','A residence exploring everyday contact with nature. Shared rooms open onto a garden, while volumes and openings balance outdoor connections with interior privacy.','courtyard-residence-exterior','courtyard-residence-interior']
      },story=narratives[id];
      localized(one('.project-detail .company-hero h1'),data[0],data[1]);
      all('[data-project-category]').forEach(el=>localized(el,data[3],data[4]));
      localized(one('[data-project-heading]'),story[0],story[1]);localized(one('[data-project-description]'),story[2],story[3]);
      const hero=one('[data-project-hero]');updateImage(hero,data[2]);hero.sizes='100vw';
      const galleryNames=[...new Set([data[2],story[4],story[5],({villa:'architecture-detail',urban:'architecture-residential',residential:'architecture-villa',interior:'architecture-atrium',lobby:'architecture-detail',plaza:'architecture-atrium',business:'architecture-studio',garden:'architecture-villa'})[id]])];
      if(galleryNames.length<4)galleryNames.push(['architecture-detail','architecture-facade','architecture-atrium'].find(name=>!galleryNames.includes(name)));
      all('[data-project-photo]').forEach((img,i)=>{updateImage(img,galleryNames[i]);img.sizes='(max-width: 767px) calc(100vw - 40px), 46vw';img.closest('a').href=img.src;});
      all('[data-project-hero],[data-project-photo]').forEach(img=>{img.dataset.altAr=data[0];img.dataset.altEn=data[1];img.alt=data[0];});
      if(id!=='villa'&&id!=='garden'){

        const outdoor=id==='urban'||id==='plaza';
        localized(one('[data-project-principle="0"]'),outdoor?'مساحات مفتوحة توازن بين الضوء والظل، وتمنح المشاة تجربة متنوعة على امتداد المسارات.':'توظيف الفتحات والعلاقات البصرية لإدخال الضوء الطبيعي وربط المساحات بمحيطها.',outdoor?'Open spaces balance light and shade, offering a varied experience along pedestrian routes.':'Openings and visual connections bring daylight into the spaces and connect them to their surroundings.');
        localized(one('[data-project-principle="1"]'),outdoor?'مسارات واضحة تربط نقاط اللقاء ومناطق الاستراحة، وتسمح بالاكتشاف دون تعقيد.':'تسلسل واضح للمداخل والمسارات يوازن بين سهولة الوصول وتنوع استخدام المساحات.',outdoor?'Clear routes connect gathering areas and resting points, allowing intuitive exploration.':'A clear sequence of entrances and routes balances easy access with varied spatial uses.');
        localized(one('[data-project-principle="2"]'),outdoor?'تناغم بين الأسطح الصلبة والعناصر الطبيعية يصنع هوية متصلة للمشهد العام.':'توازن بين الأسطح والملامس والشفافية يمنح كل مساحة شخصيتها ضمن فكرة متكاملة.',outdoor?'Hard surfaces and natural elements come together to create a coherent landscape.':'Surfaces, textures and transparency give each space its character within a coherent concept.');
      }
      const related=Object.keys(projects).filter(key=>key!==id).slice(0,2);
      all('.project-detail__related .project-card').forEach((card,i)=>{const key=related[i],item=projects[key];card.href='project-details.html?project='+key;updateImage(one('img',card),item[2]);const img=one('img',card);img.dataset.altAr=item[0];img.dataset.altEn=item[1];localized(one('h3',card),item[0],item[1]);localized(one('.project-card__info p',card),item[3],item[4]);});
    }
    if(file==='news-details.html'){const data=articles[params.get('article')]||articles.facade;localized(one('.article-detail .company-hero h1'),data[0],data[1]);updateImage(one('[data-article-hero]'),data[2]);const heroImage=one('[data-article-hero]');if(heroImage)heroImage.sizes='100vw';const category=({facade:['رؤى معمارية','Architecture'],detail:['هندسة','Engineering'],landscape:['عمران','Urbanism'],daylight:['تصميم','Design'],coordination:['هندسة','Engineering'],walkability:['عمران','Urbanism']})[params.get('article')]||['رؤى معمارية','Architecture'];localized(one('[data-article-category]'),...category);const articleId=Object.hasOwn(articles,params.get('article'))?params.get('article'):'facade';
      const photoSets={facade:['architecture-facade','architecture-atrium','architecture-detail'],detail:['architecture-detail','architecture-engineering','architecture-construction'],landscape:['architecture-urban-alt','architecture-urban','architecture-residential'],daylight:['architecture-atrium','courtyard-residence-interior','architecture-facade'],coordination:['architecture-studio','architecture-detail','architecture-construction'],walkability:['architecture-urban','architecture-urban-alt','architecture-residential']};
      const photoCaptions={facade:[['المشهد المعماري','The architectural view'],['الضوء والمساحة','Light and space'],['تفاصيل ومواد','Details and materials']],detail:[['تفاصيل البناء','Building details'],['العلاقة بين الأنظمة','Systems in context'],['من الرسم إلى الموقع','From drawings to site']],landscape:[['المكان والإنسان','Place and people'],['المسارات المفتوحة','Open pathways'],['المقياس الحضري','The urban scale']],daylight:[['ضوء طبيعي في الداخل','Daylight indoors'],['الانفتاح على الخارج','Opening to the outdoors'],['الظل في الواجهة','Shade on the facade']],coordination:[['بيئة العمل المشترك','A collaborative workspace'],['نقاط التقاء المواد','Where materials meet'],['التنسيق في الموقع','Coordination on site']],walkability:[['شبكة المشاة','The pedestrian network'],['مساحات للقاء','Places to gather'],['المباني والفراغ العام','Buildings and public space']]};
      all('[data-article-photo]').forEach((image,i)=>{updateImage(image,photoSets[articleId][i]);image.sizes=i===0?'(max-width:1360px) 100vw, 1280px':'(max-width:767px) 100vw, 46vw';const label=photoCaptions[articleId][i];image.dataset.altAr=label[0];image.dataset.altEn=label[1];image.alt=label[0];localized(one('[data-article-photo-caption="'+i+'"]'),...label);});
      const dateElement=one('[data-article-date]'),dateValue=articleDates[articleId];if(dateElement){if(dateValue){dateElement.dateTime=dateValue;const date=new Date(dateValue+'T12:00:00Z');const englishDate=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);localized(dateElement,englishDate,englishDate);}else{dateElement.removeAttribute('datetime');localized(dateElement,'Publication date not specified','Publication date not specified');}}
      const relatedIds={facade:['daylight','detail','coordination'],detail:['coordination','facade','daylight'],landscape:['walkability','daylight','facade'],daylight:['facade','walkability','detail'],coordination:['detail','facade','daylight'],walkability:['landscape','daylight','facade']}[articleId];
      all('[data-related-article]').forEach((card,i)=>{const id=relatedIds[i],item=articles[id],image=one('img',card);all('a',card).forEach(link=>link.href='news-details.html?article='+id);updateImage(image,item[2]);image.dataset.altAr=item[0];image.dataset.altEn=item[1];localized(one('h3',card),item[0],item[1]);const category=({facade:['رؤى معمارية','Architecture'],detail:['هندسة','Engineering'],landscape:['عمران','Urbanism'],daylight:['تصميم','Design'],coordination:['هندسة','Engineering'],walkability:['عمران','Urbanism']})[id];localized(one('.news-card__meta>span',card),...category);const date=one('.news-card__date',card);if(date)date.remove();});if(params.get('article')!=='facade'&&params.has('article')){localized(one('[data-article-heading="0"]'),data[3],data[4]);const paras=all('.article [data-article-paragraph]');localized(paras[0],'يتشكّل المكان من مجموعة قرارات مترابطة: كيف نتحرك، وأين يصل الضوء، وكيف تتفاعل المواد مع احتياجات المستخدم. يمنح التنسيق المبكر هذه القرارات وضوحًا ويجعل النتيجة أكثر توازنًا.','Place is shaped by connected decisions: how we move, where light falls and how materials respond to users. Early coordination brings clarity to these decisions and balance to the result.');localized(all('[data-article-heading]')[1],'التصميم كمنظومة واحدة','Design as one system');localized(paras[1],'لا تعمل التفاصيل بمعزل عن الفكرة العامة. فالمسارات والحدود والمواد تُراجع معًا لتخدم تجربة المستخدم، وتمنح كل مساحة دورًا واضحًا ضمن المشروع.','Details do not work in isolation. Routes, boundaries and materials are reviewed together to serve users and give each space a clear role.');}}
    if(file==='news-details.html'){const content={"daylight":[["يبدأ تصميم الضوء من اتجاه المبنى وعمق الفراغ، لا من حجم النافذة وحده. تساعد قراءة مسار الشمس وطبيعة الاستخدام على اختيار أماكن الفتحات وتوزيع المساحات التي نحتاج فيها إلى التركيز أو الراحة.","Designing for daylight starts with orientation and room depth, rather than window size alone. Reading the sun path and understanding use help locate openings and organise spaces for focus or rest."],["الانفتاح والراحة","Openness and comfort","لا يعني المزيد من الزجاج دائمًا مساحة أفضل. تسمح المظلات والفتحات المدروسة بدخول الضوء مع الحد من الوهج، وتمنح الداخل توازنًا بين الاتصال بالخارج والخصوصية.","More glass does not always mean a better space. Shading and carefully placed openings bring in light while limiting glare, balancing an outdoor connection with privacy."],["ضوء يتغير مع اليوم","Light through the day","تتغير جودة الضوء بين الصباح والمساء. وعندما تُدرس الأسطح والألوان والفتحات معًا، يصبح هذا التغيّر جزءًا من تجربة المكان بدل أن يكون عائقًا أمام استخدامه.","The quality of light shifts from morning to evening. Considering surfaces, colours and openings together makes these changes part of the spatial experience rather than an obstacle to use."]],"coordination":[["يلتقي المعماري والإنشائي والخدمات داخل المساحة نفسها. وتساعد المراجعة المبكرة على فهم تأثير كل قرار على الآخر، من ارتفاعات الأسقف إلى مسارات الخدمات ومواقع العناصر الإنشائية.","Architecture, structure and building services share the same space. Early reviews reveal how each decision affects the others, from ceiling heights to service routes and structural elements."],["من الرسم إلى قرار واضح","From drawing to clear decisions","تحتاج المراجعة إلى مرجع مشترك للرسومات وتوثيق واضح للتعديلات. فوضوح الإصدار والمسؤولية عن القرار يقلل الالتباس، ويمنح فريق المشروع أساسًا منظمًا للنقاش.","Reviews need shared drawing references and clearly documented changes. Clear versions and decision ownership reduce ambiguity and give the project team an organised basis for discussion."],["حماية الفكرة بالتفاصيل","Protecting the idea through detail","تُختبر التفاصيل عند نقاط التقاء المواد والأنظمة. ويوازن الحل الجيد بين المقصود المعماري ومتطلبات التنفيذ والصيانة، مع مراجعة أثر التعديل على بقية المشروع.","Details are tested where materials and systems meet. A good solution balances architectural intent with construction and maintenance, while reviewing how changes affect the rest of the project."]],"walkability":[["تبدأ تجربة المشاة باستمرار المسار ووضوح وجهته. فعندما ترتبط المداخل والساحات والخدمات بمسافات مقروءة، يصبح المشي اختيارًا مفهومًا ضمن الحياة اليومية.","A pedestrian experience begins with a continuous route and a clear destination. Connecting entrances, squares and services through legible distances makes walking an intuitive everyday choice."],["الراحة على امتداد الطريق","Comfort along the route","يحتاج المشاة إلى ظل ومناطق للجلوس وعبور آمن. وتُراجع هذه العناصر مع عرض المسار وتنوع احتياجات المستخدمين، حتى لا تنقطع التجربة عند نقطة واحدة غير مريحة.","Pedestrians need shade, seating and safe crossings. Reviewing these alongside path width and different user needs prevents one uncomfortable point from disrupting the whole journey."],["الفراغ العام كوجهة","Public space as a destination","تمنح الواجهات النشطة والخضرة ومناطق اللقاء المسار أسبابًا للتوقف. بذلك لا يبقى الطريق مجرد وصلة بين مكانين، بل يصبح مساحة للتفاعل والاكتشاف.","Active frontages, greenery and gathering areas offer reasons to pause. A route becomes more than a connection between two places: it becomes a space for interaction and discovery."]]}[params.get('article')];if(content){const heads=all('[data-article-heading]'),paragraphs=all('.article [data-article-paragraph]');localized(paragraphs[0],content[0][0],content[0][1]);for(let i=1;i<3;i++){localized(heads[i],content[i][0],content[i][1]);localized(paragraphs[i],content[i][2],content[i][3]);}}}

  }
  function setupProjectGallery(){
    const dialog=one('#project-lightbox'),links=all('[data-gallery-open]');if(!dialog||!links.length)return;
    const image=one('[data-gallery-image]',dialog),status=one('[data-gallery-status]',dialog),thumbRoot=one('[data-gallery-thumbs]',dialog);let active=0;
    const caption=i=>one('[data-project-caption]',links[i].closest('figure')).textContent;
    const thumbs=links.map((link,i)=>{const button=document.createElement('button'),thumb=document.createElement('img');button.type='button';button.className='project-lightbox__thumb';thumb.src=one('img',link).src;thumb.width=96;thumb.height=72;thumb.alt='';thumb.loading='lazy';button.append(thumb);button.addEventListener('click',()=>show(i));thumbRoot.append(button);return button;});
    function show(index){active=(index+links.length)%links.length;const source=one('img',links[active]);image.src=source.src;image.alt=caption(active);status.textContent=(active+1)+' / '+links.length+' — '+caption(active);thumbs.forEach((thumb,i)=>{thumb.setAttribute('aria-label',caption(i));thumb.setAttribute('aria-pressed',String(i===active));});}
    links.forEach((link,i)=>link.addEventListener('click',event=>{event.preventDefault();show(i);dialog.showModal();document.body.classList.add('project-gallery-open');}));
    one('[data-gallery-close]',dialog).addEventListener('click',()=>dialog.close());
    one('[data-gallery-prev]',dialog).addEventListener('click',()=>show(active-1));one('[data-gallery-next]',dialog).addEventListener('click',()=>show(active+1));
    dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(active+((event.key==='ArrowLeft')===(state.lang==='ar')?1:-1));}});
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>document.body.classList.remove('project-gallery-open'));
    document.addEventListener('asas:languagechange',()=>{if(dialog.open)show(active);});
  }
  function setupArticleSharing(){
    const root=one('.article-detail');if(!root)return;const button=one('[data-copy-article]',root),status=one('[data-copy-status]',root);
    function links(){const url=encodeURIComponent(location.href),title=encodeURIComponent(one('h1',root).textContent);const urls={whatsapp:'https://wa.me/?text='+title+'%20'+url,x:'https://twitter.com/intent/tweet?text='+title+'&url='+url,linkedin:'https://www.linkedin.com/sharing/share-offsite/?url='+url};all('[data-article-share]',root).forEach(link=>link.href=urls[link.dataset.articleShare]);}
    links();document.addEventListener('asas:languagechange',()=>{links();status.textContent='';});button.addEventListener('click',async()=>{try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(location.href);else{const field=document.createElement('textarea');field.value=location.href;field.className='article-detail__copy-field';document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();if(!copied)throw Error('copy');}status.textContent=state.lang==='ar'?'تم نسخ الرابط':'Link copied';}catch{status.textContent=state.lang==='ar'?'تعذّر النسخ؛ انسخ رابط الصفحة من المتصفح.':'Copy the page address from your browser.';}});
  }
  function setupSharing(){all('[data-share]').forEach(button=>button.addEventListener('click',async()=>{const title=document.title,url=location.href;try{if(navigator.share)await navigator.share({title,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);button.setAttribute('aria-label',state.lang==='ar'?'تم نسخ الرابط':'Link copied');const label=one('[data-ar]',button);if(label)localized(label,'تم نسخ الرابط','Link copied');}else{openDialog(one('#info-dialog'));localized(one('#info-dialog p'),url,url);}}catch{}}));}
  try{state.lang=localStorage.getItem('asas-lang')==='en'?'en':'ar';}catch{}
  setupContactPage();setupDetails();setupNavigation();setupSearch();setupFilters();setupSlider();setupCarousels();setupMotion();setupForms();setupCareerFile();setupCareerValidation();setupCareerJobs();setupSharing();setupArticleSharing();setupProjectGallery();applyLanguage(state.lang);setupEntrances();setupServiceJourney();
})();
