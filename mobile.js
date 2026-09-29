/* Shared phone/tablet behavior. Load at the end of <body>, after the page's own script has built its content. */
(function(){
  var mq=window.matchMedia('(max-width:820px)');

  // Keep the current page's link in view in the sideways-scrolling top bar.
  var bar=document.querySelector('.topbar .wrap'), act=bar&&bar.querySelector('a.active');
  if(act&&act.offsetLeft+act.offsetWidth>bar.clientWidth-24) bar.scrollLeft=act.offsetLeft-(bar.clientWidth-act.offsetWidth)/2;

  // Collapsible Contents list, plus a floating button to get back to it from deep in the page.
  var nav=document.querySelector('nav.side');
  if(nav){
    var btn=document.createElement('button');
    btn.type='button'; btn.className='toc-toggle'; btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span>Contents</span><span class="chev" aria-hidden="true">▾</span>';
    nav.insertBefore(btn,nav.firstChild);
    nav.classList.add('collapsed');
    var setOpen=function(open){nav.classList.toggle('collapsed',!open); btn.setAttribute('aria-expanded',open?'true':'false');};
    btn.addEventListener('click',function(){setOpen(nav.classList.contains('collapsed'));});
    nav.addEventListener('click',function(e){ if(mq.matches&&e.target.closest&&e.target.closest('a')) setOpen(false); });

    var fab=document.createElement('button');
    fab.type='button'; fab.className='toc-fab'; fab.textContent='☰ Contents';
    fab.addEventListener('click',function(){ setOpen(true); nav.scrollIntoView({block:'start'}); btn.focus({preventScroll:true}); });
    document.body.appendChild(fab);
    var onScroll=function(){ fab.classList.toggle('show',mq.matches&&nav.getBoundingClientRect().bottom<0); };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  // Label table cells from their column headers so rows can stack as cards on phones.
  [].forEach.call(document.querySelectorAll('table'),function(t){
    t.classList.add('stack');
    if(t.classList.contains('tr')||t.hasAttribute('data-nolabel')) return; // pros/cons tables mark cells with + and −; two-column tables need no labels
    var heads=[].map.call(t.querySelectorAll('thead tr:first-child th'),function(h){return h.textContent.trim();});
    if(!heads.length) return;
    [].forEach.call(t.querySelectorAll('tbody tr'),function(r){
      [].forEach.call(r.children,function(c,i){ if(c.tagName==='TD'&&heads[i]) c.setAttribute('data-label',heads[i]); });
    });
  });

  // Tell phone readers that wide diagrams scroll sideways.
  [].forEach.call(document.querySelectorAll('.diagram'),function(d){
    var p=document.createElement('p'); p.className='swipe-hint'; p.textContent='Diagram: swipe sideways to see all of it →';
    d.parentNode.insertBefore(p,d);
  });
})();
