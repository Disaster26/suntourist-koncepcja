(function(){
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* menu mobilne */
var bg=$('.burger'),menu=$('#menu');
bg.addEventListener('click',function(){var o=menu.hidden;menu.hidden=!o;bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu')});
$$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.hidden=true;bg.setAttribute('aria-expanded','false')})});

/* karuzela: palec, mysz, strzalki */
var row=$('#row');
$$('.arrows button').forEach(function(b){b.addEventListener('click',function(){var c=row.querySelector('.card');row.scrollBy({left:(+b.dataset.dir)*(c.offsetWidth+16),behavior:'smooth'})})});
var down=false,sx=0,sl=0,moved=false;
row.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=row.scrollLeft});
window.addEventListener('pointermove',function(e){if(!down)return;var d=e.clientX-sx;if(Math.abs(d)>5){moved=true;row.classList.add('drag')}row.scrollLeft=sl-d});
window.addEventListener('pointerup',function(){if(!down)return;down=false;row.classList.remove('drag')});
row.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);

/* katalog z filtrami */
var cards=$$('#grid .card'),st={r:'',k:'',m:'',c:'',d:''};
var fk=$('#fk'),fm=$('#fm'),fc=$('#fc'),fd=$('#fd'),cnt=$('#cnt'),clr=$('#clear'),empty=$('#empty');
function ok(el,skipR){
  if(!skipR&&st.r&&el.dataset.r!==st.r)return false;
  if(st.k&&el.dataset.k.split(' ').indexOf(st.k)<0)return false;
  if(st.m&&el.dataset.m.split(' ').indexOf(st.m)<0)return false;
  if(st.c){var p=st.c.split('-'),c=+el.dataset.c;if(c<+p[0]||c>+p[1])return false}
  if(st.d){var q=st.d.split('-'),d=+el.dataset.d;if(d<+q[0]||d>+q[1])return false}
  return true}
function odm(n){return n===1?'wycieczka':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'wycieczki':'wycieczek'}
var more=$('#more'),grid=$('#grid');
more.addEventListener('click',function(){grid.classList.add('all')});
function apply(){
  var n=0;grid.classList.add('all');cards.forEach(function(el){var v=ok(el);if(v)n++;el.hidden=!v});
  cnt.textContent=n+' '+odm(n);empty.hidden=n>0;
  clr.hidden=!(st.r||st.k||st.m||st.c||st.d);
  $$('#chips .chip').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.r===st.r);var r=b.dataset.r;b.querySelector('small').textContent=cards.filter(function(el){return ok(el,true)&&(!r||el.dataset.r===r)}).length})}
$$('#chips .chip').forEach(function(b){b.addEventListener('click',function(){st.r=b.dataset.r;apply()})});
[[fk,'k'],[fm,'m'],[fc,'c'],[fd,'d']].forEach(function(p){p[0].addEventListener('change',function(){st[p[1]]=p[0].value;apply()})});
clr.addEventListener('click',function(){st={r:'',k:'',m:'',c:'',d:''};fk.value=fm.value=fc.value=fd.value='';apply()});
$('#szukaj').addEventListener('submit',function(e){e.preventDefault();st.k=fk.value=$('#sk').value;st.m=fm.value=$('#sm').value;st.c=fc.value=$('#sc').value;apply();$('#katalog').scrollIntoView({behavior:'smooth'})});
$$('.quick a').forEach(function(a){a.addEventListener('click',function(){st.r=a.dataset.r;apply()})});

/* rezerwacja pokazowa */
var CENA=3000,q=1,qo=$('#q'),f=$('#rez');
function zl(v){return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' zł'}
function sum(){var z=+f.querySelector('input[name=z]:checked').value;qo.textContent=q;$('#sv').textContent=zl(CENA*q);$('#sp').textContent=zl(Math.round(CENA*q*z/100))}
$$('.qty button').forEach(function(b){b.addEventListener('click',function(){q=Math.min(20,Math.max(1,q+(+b.dataset.q)));sum()})});
$$('input[name=z]',f).forEach(function(i){i.addEventListener('change',sum)});
$$('#rez input[type=radio]').forEach(function(i){i.addEventListener('change',function(){$$('#rez input[name='+i.name+']').forEach(function(o){o.parentNode.classList.toggle('on',o.checked)})})});
f.addEventListener('submit',function(e){e.preventDefault();$('#msg').hidden=false});

/* galeria */
var lb=$('#lb'),li=$('#lb img');
$$('#gal button').forEach(function(b){b.addEventListener('click',function(){li.src=b.dataset.src;li.alt=b.querySelector('img').alt;lb.hidden=false;$('#lb button').focus()})});
function zam(){lb.hidden=true}
$('#lb button').addEventListener('click',zam);lb.addEventListener('click',function(e){if(e.target===lb)zam()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')zam()});

/* mapa przy przewinieciu */
var map=$('#map');
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){var i=document.createElement('iframe');i.src=map.dataset.src;i.title='Mapa dojazdu: ul. Wieniawskiego 15, Zamość';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';map.appendChild(i);io.disconnect()}},{rootMargin:'200px'});io.observe(map)}
})();
