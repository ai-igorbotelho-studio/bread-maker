/* Bread Maker app: recipe browser, menu chart, favourites and an estimated nutrition table per recipe. */
(function(){
"use strict";

/* ---------- nutrition reference (per 100 g): kcal, protein, carbs, sugars, fat, fibre, sodium mg; d = g per mL for volume measures ---------- */
var N={
 water:[0,0,0,0,0,0,0,1],milk:[61,3.2,4.8,5,3.3,0,44,1.03],yog:[61,3.5,4.7,4.7,3.3,0,46,1.03],
 egg:[143,12.6,.7,.4,9.5,0,142,1],yeast:[325,40,41,0,7.6,27,51,.6],
 flour:[350,12,72,.5,1.5,3,2,.55],wheat:[340,13,61,1,2.5,11,2,.55],rye:[325,9,69,1,1.5,15,2,.55],gluten:[370,75,14,0,2,1,30,.55],
 rice:[365,6,80,0,1.4,2.4,0,.6],starch:[350,0,88,0,0,1,0,.55],besan:[387,22,58,10,7,11,64,.5],
 oats:[375,13,67,1,7,10,2,.4],buck:[343,13,72,0,3.4,10,1,.65],corn:[362,8,77,.6,3.6,7,35,.6],bran:[216,16,65,0,4,42,2,.25],
 sugar:[400,0,100,100,0,0,0,.85],brown:[380,0,98,97,0,0,28,.8],honey:[304,.3,82,82,0,0,4,1.4],syrup:[290,0,75,70,0,0,30,1.4],
 butter:[717,.9,.1,.1,81,0,11,.95],oil:[884,0,0,0,100,0,0,.92],salt:[0,0,0,0,0,0,38758,1.2],
 mpow:[496,26,38,38,27,0,370,.45],cheese:[403,25,1.3,.5,33,0,621,.45],parm:[431,38,4,.9,29,0,1529,.4],
 walnut:[654,15,14,2.6,65,7,2,.5],pine:[673,14,13,3.6,68,4,2,.55],nuts:[607,20,21,4,54,7,5,.5],
 sesame:[573,18,23,.3,50,12,11,.6],poppy:[525,18,28,3,42,20,26,.6],sunfl:[584,21,20,2.6,51,9,9,.6],lin:[534,18,29,1.5,42,27,30,.65],seedmix:[560,20,24,2,48,13,15,.6],
 dried:[299,3,79,59,.5,3.7,11,.65],dates:[282,2.5,75,63,.4,8,2,.6],bchip:[519,2.3,58,35,34,7.7,6,.4],banana:[89,1.1,23,12,.3,2.6,1,1],
 peel:[320,.3,83,70,.3,5,30,.5],rind:[97,1.5,25,0,.2,10,3,.4],choc:[480,4,63,50,24,5,10,.7],cocoa:[228,20,58,2,14,33,21,.45],
 garlic:[149,6,33,1,.5,2,17,.9],onion:[349,9,83,38,1.5,9,21,.3],kumara:[86,1.6,20,4.2,.1,3,55,1],
 tpaste:[82,4.3,19,12,.5,4.1,98,1.1],sdt:[213,5,23,16,14,6,266,.9],corncook:[96,3.4,21,4.5,1.5,2.4,1,.65],worc:[78,0,19,10,0,0,980,1.1],
 olive:[115,.8,6,0,11,3,735,.6],mustard:[508,26,28,7,36,12,13,.4],vinegar:[18,0,0,0,0,0,2,1],xan:[333,0,78,0,0,78,0,.6],
 rum:[231,0,0,0,0,0,0,.95],vanilla:[288,0,13,13,0,0,9,.9],bpow:[53,0,28,0,0,0,10600,.9],bsoda:[0,0,0,0,0,0,27360,.9],pectin:[325,0,90,0,0,9,0,.6],
 straw:[32,.7,7.7,4.9,.3,2,1,1],blue:[57,.7,14,10,.3,2.4,1,1],rasp:[52,1.2,12,4.4,.7,6.5,1,1],peach:[39,.9,9.5,8.4,.3,1.5,0,1],berries:[45,1,10,6,.4,3.5,1,1],apple:[52,.3,14,10,.2,2.4,1,1],
 lemon:[22,.4,7,2.5,.2,.3,1,1],
 hemp:[553,31,9,1.5,49,4,5,.6],chia:[486,17,42,0,31,34,16,.6],pump:[559,30,11,1.4,49,6,7,.6],almond:[579,21,22,4,50,12,1,.5],pecan:[691,9,14,4,72,10,0,.5],cashew:[553,18,30,6,44,3,12,.55],peanut:[567,26,16,5,49,9,18,.6],
 cranb:[308,0,82,65,1.4,5,3,.65],coconut:[660,7,24,7,65,16,37,.35],feta:[264,14,4,4,21,0,917,.5],bacon:[541,37,1.4,0,42,0,1717,.7],carrot:[41,.9,10,4.7,.2,2.8,69,.5],zucc:[17,1.2,3,2.5,.3,1,8,.6],spinach:[23,2.9,3.6,.4,.4,2.2,79,.3],
 psyll:[200,1.5,89,0,0,78,20,.3],quinoa:[368,14,64,0,6,7,5,.6],millet:[378,11,73,0,4,9,5,.6],protein:[370,80,8,2,5,2,200,.4],jalap:[29,.9,6.5,4,.4,2.8,3,.6],herb:[36,3,6,.5,.7,3,25,.2],spice:[250,10,60,1,6,30,30,.4],zero:[0,0,0,0,0,0,0,1]
};
var RULES=[
 [/hemp/,"hemp"],[/chia/,"chia"],[/pumpkin seed|pepita/,"pump"],[/almond/,"almond"],[/pecan/,"pecan"],[/cashew/,"cashew"],[/peanut/,"peanut"],[/cranberr/,"cranb"],[/coconut/,"coconut"],[/feta/,"feta"],[/bacon|salami|chorizo|ham/,"bacon"],
 [/carrot/,"carrot"],[/zucchini|courgette/,"zucc"],[/spinach|kale/,"spinach"],[/psyllium/,"psyll"],[/quinoa/,"quinoa"],[/millet/,"millet"],[/protein powder|whey/,"protein"],[/jalape|capsicum/,"jalap"],[/flax/,"lin"],[/maple|molasses/,"syrup"],[/apricot|fig|prune/,"dried"],
 [/water/,"water"],[/surebake|yeast/,"yeast"],[/egg/,"egg"],[/powdered milk|milk powder/,"mpow"],[/yog/,"yog"],[/milk/,"milk"],
 [/gluten flour/,"gluten"],[/wholemeal|whole wheat|wholegrain|kibbled/,"wheat"],[/rye/,"rye"],[/rice flour|rice/,"rice"],[/arrowroot|tapioca/,"starch"],[/besan|soya/,"besan"],
 [/bread flour|white flour|plain flour|spelt|bread mix/,"flour"],[/oat/,"oats"],[/buckwheat/,"buck"],[/cornmeal/,"corn"],[/bran/,"bran"],
 [/brown sugar/,"brown"],[/sugar/,"sugar"],[/honey/,"honey"],[/treacle|golden syrup/,"syrup"],[/butter/,"butter"],[/oil/,"oil"],[/salt/,"salt"],
 [/parmesan/,"parm"],[/cheese/,"cheese"],[/walnut/,"walnut"],[/pinenut/,"pine"],[/nuts/,"nuts"],[/sesame/,"sesame"],[/poppy/,"poppy"],[/sunflower/,"sunfl"],[/linseed/,"lin"],[/seed mix/,"seedmix"],
 [/raisin|sultana|currant|dried fruit/,"dried"],[/dates/,"dates"],[/banana chip/,"bchip"],[/banana/,"banana"],[/orange peel/,"peel"],[/orange rind|zest/,"rind"],[/choc/,"choc"],[/cocoa/,"cocoa"],
 [/garlic/,"garlic"],[/onion/,"onion"],[/kumara/,"kumara"],[/tomato paste/,"tpaste"],[/sundried/,"sdt"],[/corn,/,"corncook"],[/worc/,"worc"],[/olive/,"olive"],[/mustard/,"mustard"],[/vinegar/,"vinegar"],[/xantan|xanthan/,"xan"],
 [/rum/,"rum"],[/vanilla ess/,"vanilla"],[/baking powder/,"bpow"],[/baking soda/,"bsoda"],[/pectin/,"pectin"],
 [/strawberr/,"straw"],[/blueberr/,"blue"],[/raspberr/,"rasp"],[/peach/,"peach"],[/berries/,"berries"],[/apple/,"apple"],[/lemon juice/,"lemon"],
 [/improver|cinnamon stick|cloves|vanilla pod/,"zero"],[/fresh/,"herb"],[/herb|basil|rosemary|thyme|tarragon|oregano|cinnamon|spice|nutmeg|cumin|curry|chilli|allspice|pepper/,"spice"]
];
var FR={"¼":.25,"½":.5,"¾":.75,"⅓":1/3,"⅔":2/3,"⅛":.125};
var VOL={tsp:5,tbsp:15,cup:250,ml:1};
function grams(name,qty){
 var n=name.toLowerCase(),key="zero";
 for(var i=0;i<RULES.length;i++)if(RULES[i][0].test(n)){key=RULES[i][1];break}
 var ref=N[key],s=String(qty);
 var par=s.match(/\((\d+(?:\.\d+)?)\s*g\)/);           /* "2 (100 g)" */
 if(par)return {k:key,g:+par[1]};
 s=s.replace(/\(.*?\)/g,"").replace(/[¼½¾⅓⅔⅛]/g,function(m){return " "+FR[m]});
 var rng=s.match(/([\d.]+)\s*[–-]\s*([\d.]+)/);if(rng)s=s.replace(rng[0],String((+rng[1]+ +rng[2])/2));
 var m=s.match(/^\s*([\d.\s]+)\s*(g|ml|tsp|tbsp|cup)?/i);if(!m)return {k:key,g:0};
 var v=m[1].trim().split(/\s+/).reduce(function(a,b){return a+(+b||0)},0),u=(m[2]||"").toLowerCase();
 if(u==="g")return {k:key,g:v};
 if(VOL[u])return {k:key,g:v*VOL[u]*ref[7]};
 /* a count: eggs, bananas, lemons */
 if(key==="egg")return {k:key,g:v*50};if(key==="banana")return {k:key,g:v*100};if(key==="rind")return {k:key,g:v*5};
 return {k:key,g:0};
}
function nutrition(rows){
 var t=[0,0,0,0,0,0,0],w=0;
 rows.forEach(function(r){var x=grams(r.name,r.qty),ref=N[x.k];w+=x.g;for(var i=0;i<7;i++)t[i]+=ref[i]*x.g/100});
 return {t:t,w:w};
}

/* ---------- state ---------- */
var SIZES=["M","L","XL"],GRPS=["All","Bread","Gluten free","Dough","Cake","Jam","Compote"];
var GCLASS={"Bread":"g-bread","Gluten free":"g-gluten","Dough":"g-dough","Cake":"g-cake","Jam":"g-jam","Compote":"g-compote"};
var SERVES={"Bread":[12,14,16],"Gluten free":[12,12,12],"Dough":[12,12,12],"Cake":[10,10,10],"Jam":[20,20,20],"Compote":[20,20,20]};
var st={view:"home",size:1,grp:"All",menu:"All",times:[],diet:[],src:[],q:"",favs:{},open:null,tab:"ing",step:0,serves:null};
var CUSTOM=[];
try{var sv=JSON.parse(localStorage.getItem("bm")||"{}");if(Array.isArray(sv.custom)){CUSTOM=sv.custom.filter(function(c){return c&&typeof c.n==="string"&&SERVES[c.g]&&Array.isArray(c.both)&&Array.isArray(c.m)&&typeof c.time==="string"});CUSTOM.forEach(function(c){c.custom=true;R.push(c)})}if([0,1,2].indexOf(sv.size)>=0)st.size=sv.size;if(sv.favs)st.favs=sv.favs;if(sv.theme)document.documentElement.setAttribute("data-theme",sv.theme)}catch(e){}
function save(){try{localStorage.setItem("bm",JSON.stringify({size:st.size,favs:st.favs,custom:CUSTOM,theme:document.documentElement.getAttribute("data-theme")||""}))}catch(e){}}
function $(i){return document.getElementById(i)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

/* ---------- icons ---------- */
var I={
 home:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/></svg>',
 list:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
 heart:'<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.2C1 7.9 3.6 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 6 3.4 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>',
 search:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 sun:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 x:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 loaf:'<svg class="illus" viewBox="0 0 120 80" fill="currentColor"><path d="M14 40c0-14 12-24 46-24s46 10 46 24v22a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z"/><path d="M38 30c6-8 10-8 16 0M62 30c6-8 10-8 16 0" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="4" stroke-linecap="round"/></svg>',
 roll:'<svg class="illus" viewBox="0 0 120 80" fill="currentColor"><circle cx="34" cy="46" r="22"/><circle cx="86" cy="46" r="22"/><circle cx="60" cy="30" r="22"/></svg>',
 cake:'<svg class="illus" viewBox="0 0 120 80" fill="currentColor"><rect x="16" y="34" width="88" height="36" rx="8"/><path d="M16 42c10 8 20-8 30 0s20-8 30 0 18-8 28 0" fill="none" stroke="rgba(0,0,0,.2)" stroke-width="5"/><rect x="56" y="12" width="8" height="18" rx="3"/></svg>',
 jar:'<svg class="illus" viewBox="0 0 120 80" fill="currentColor"><rect x="36" y="6" width="48" height="12" rx="4"/><path d="M34 22h52v44a10 10 0 0 1-10 10H44a10 10 0 0 1-10-10z"/><rect x="42" y="38" width="36" height="16" rx="4" fill="rgba(0,0,0,.18)"/></svg>',
 bowl:'<svg class="illus" viewBox="0 0 120 80" fill="currentColor"><path d="M10 34h100c0 22-16 40-50 40S10 56 10 34z"/><circle cx="40" cy="24" r="8"/><circle cx="62" cy="18" r="9"/><circle cx="82" cy="26" r="7"/></svg>'
};
var GICON={"Bread":I.loaf,"Gluten free":I.loaf,"Dough":I.roll,"Cake":I.cake,"Jam":I.jar,"Compote":I.bowl};


/* ---------- photos (Unsplash License, self-hosted in img/) ---------- */
var PHOTO={"White Loaf":"white","Rapid White Loaf":"white","Basic Sandwich Bread":"white","Kumara Bread":"white","Cheese & Mustard Loaf":"white","Mexican Chilli Loaf":"white","Curry & Onion Loaf":"white",
 "Wheat and Gluten Free Bread":"white","Yeasted Plain Gluten Free Loaf":"white",
 "Garlic Herb Bread":"rustic","Rosemary & Pinenut Loaf":"rustic","Spelt White Bread":"rustic","Rosemary & Thyme Loaf":"basket",
 "Italian Bread":"roundloaf","Herb Bread":"roundloaf","Sundried Tomato and Parmesan":"roundloaf",
 "French Bread":"baguette","Tarragon & Thyme Bread":"baguette","French Bread (dough)":"baguette",
 "Wholemeal Loaf 75%":"wholemeal","Wholemeal Loaf 100%":"wholemeal","Wholemeal Loaf 50%":"wholemeal","Rapid Wholemeal Loaf 75%":"wholemeal","Whole Wheat Sandwich Bread":"wholemeal","Sesame & Bran Loaf":"wholemeal",
 "Rye 100%":"rye","Rye and Wholemeal":"rye","Mixed Grain Bread":"rye","Rye and Spelt":"ryeslice","Whole Spelt Bread":"ryeslice","Rye & White Rolls (stage 1)":"basket","Rye & White Rolls (stage 2)":"basket",
 "Chocolate Nut Bread":"chocslice","Chocolate Cake":"chocolatecake","Butter Cake":"buttercake","Fruit & Walnut Cake":"berrycake",
 "Banana Yoghurt Tea Bread":"loafcake","Date & Nut Loaf":"loafcake","Spicy Fruit Loaf":"loafcake","Spicy Fruit Loaf (wholemeal)":"loafcake","Banana Cinnamon Loaf":"loafcake","Orange Poppyseed Loaf":"loafcake",
 "Basic Brioche":"pastries","Chocolate Chip Brioche Rolls (12)":"pastries","Pannettone":"bakery",
 "Basic Dough":"rolls","Wholemeal Dough 75%":"rolls","Olive & Rosemary Rolls":"rolls","Sundried Tomato & Basil Rolls":"rolls","Sunflower & Kibblewheat Rolls":"rolls","Spelt Table Rolls (8)":"rolls","Whole Wheat Raisin Rolls":"rolls",
 "Croissants":"croissants","Doughnuts":"doughnuts","Hot Cross Buns":"cinnamon","Swedish Tea Ring":"cinnamon","Bagels":"bagels","Pizza":"pizza","Focaccia":"focaccia",
 "Strawberry Jam":"strawberries","Blueberry Jam":"blueberries","Peach Melba":"peaches","Frozen Berry Jam":"raspberries",
 "Spiced Apple Compote":"apple","Mixed Berry Compote":"raspberries","Apple Sauce":"apples","Peach in Vanilla Syrup":"peaches"};
var GPHOTO={"Bread":"white","Gluten free":"white","Dough":"rolls","Cake":"buttercake","Jam":"strawberries","Compote":"apples"};
function photo(r){return "img/"+(PHOTO[r.p||r.n]||GPHOTO[r.g])+".jpg"}

/* ---------- helpers ---------- */
function regionRows(r){
 var d=r.both||r.nz,note="";
 if(!d){d=r.oz;note="The manual prints this recipe for Australia only, so these are its Australian quantities (dry yeast and bread flour rather than Surebake yeast and white flour)."}
 var rows=(d||[]).map(function(line){var p=line.split("|"),late=p[0].charAt(0)==="*";
  return {name:late?p[0].slice(1):p[0],late:late,qty:r.sz===3&&p.length>2?p[1+st.size]:p[1]}});
 return {rows:rows,note:note};
}
function serves(r){if(r.serves>0)return r.serves;var m=!r.custom&&r.n.match(/\((\d+)\)/);return m?+m[1]:SERVES[r.g][r.sz===3?st.size:0]}
var TIMES=[["u1","Under 1 hr",0,60],["t12","1–2 hr",60,120],["t24","2–4 hr",120,240],["o4","Over 4 hr",240,1e9]];
var DIET=[["lowcarb","Low carb","60% or less of energy from carbohydrate"],["protein","High protein","14% or more of energy from protein"]];
function minutes(t){var last=t.split("–").pop(),h=last.match(/(\d+)\s*h/),m=last.match(/(\d+)\s*min/);return (h?+h[1]*60:0)+(m?+m[1]:0)}
function shares(r){var x=regionRows(r);if(!x.rows.length)return null;var t=nutrition(x.rows).t,k=t[1]*4+t[2]*4+t[4]*9||1;return {carb:t[2]*4/k,prot:t[1]*4/k}}
function diet(r,key){var s=shares(r);if(!s)return false;return key==="lowcarb"?s.carb<=.6:s.prot>=.14}
function kcalPerServe(r){
 var x=regionRows(r);if(!x.rows.length)return null;
 var n=nutrition(x.rows),s=serves(r);
 return Math.round(n.t[0]/s);
}
function filtered(){
 var q=st.q.trim().toLowerCase();
 return R.filter(function(r,i){
  if(st.view==="saved"&&!st.favs[r.n])return false;
  if(st.grp!=="All"&&r.g!==st.grp)return false;
  if(st.menu!=="All"&&r.m.indexOf(st.menu)<0)return false;
  if(st.src.length&&st.src.indexOf(r.custom?"custom":"orig")<0)return false;
  if(st.times.length){var mins=minutes(r.time),ok=TIMES.some(function(t){return st.times.indexOf(t[0])>=0&&mins>t[2]&&mins<=t[3]});if(!ok)return false}
  if(st.diet.some(function(k){return !diet(r,k)}))return false;
  if(q&&(r.n+" "+r.g+" menu "+r.m.join(" ")).toLowerCase().indexOf(q)<0)return false;
  return true}).sort(function(a,b){return (b.custom?1:0)-(a.custom?1:0)});
}
function toast(msg){var t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove("show")},1600)}

/* ---------- rendering ---------- */
function drawChips(){
 $("chips").innerHTML=GRPS.map(function(g){return '<button class="chip" aria-pressed="'+(st.grp===g)+'" data-grp="'+esc(g)+'">'+esc(g)+'</button>'}).join("");
 var ms={};R.forEach(function(r){r.m.forEach(function(m){ms[m]=1})});
 $("mchips").innerHTML='<button class="chip'+(st.menu==="All"?" on":"")+'" aria-pressed="'+(st.menu==="All")+'" data-menu="All">All menus</button>'+Object.keys(ms).sort().map(function(m){var mr=MENUS.filter(function(x){return x[0]===m})[0];return '<button class="chip'+(st.menu===m?" on":"")+'" aria-pressed="'+(st.menu===m)+'" data-menu="'+m+'">'+m+' '+esc(mr?mr[1]+(mr[2]==="Dough"&&m<"26"?" dough":""):"")+'</button>'}).join("");
 $("tchips").innerHTML='<span class="lbl">Recipes from</span><button class="chip" aria-pressed="'+(st.src.indexOf("orig")>=0)+'" data-src="orig" title="The manual\'s recipes">Original</button><button class="chip" aria-pressed="'+(st.src.indexOf("custom")>=0)+'" data-src="custom" title="Recipes you created">Created'+(CUSTOM.length?' ('+CUSTOM.length+')':'')+'</button><span class="lbl">Time to bake</span>'+TIMES.map(function(t){return '<button class="chip" aria-pressed="'+(st.times.indexOf(t[0])>=0)+'" data-time="'+t[0]+'">'+t[1]+'</button>'}).join("")+'<span class="lbl">Diet</span>'+DIET.map(function(d){return '<button class="chip" aria-pressed="'+(st.diet.indexOf(d[0])>=0)+'" data-diet="'+d[0]+'" title="'+d[2]+'">'+d[1]+'</button>'}).join("")+(st.times.length||st.diet.length||st.src.length?'<button class="chip clear" data-clearf="1">Clear</button>':'');
 $("size").innerHTML=SIZES.map(function(s,i){return '<button aria-pressed="'+(st.size===i)+'" data-size="'+i+'">'+s+'</button>'}).join("");
}
function drawCards(){
 var list=filtered();
 $("count").textContent=list.length+" of "+R.length;
 var fl=st.diet.map(function(k){return DIET.filter(function(d){return d[0]===k})[0][1].toLowerCase()});
 $("head").textContent=(st.view==="saved"?"Saved recipes":(st.grp==="All"?"All recipes":st.grp))+(fl.length?" · "+fl.join(" + "):"")+(st.times.length?" · "+st.times.length+" time range"+(st.times.length>1?"s":""):"")+(st.src.length===1?" · "+(st.src[0]==="custom"?"created by you":"from the manual"):"");
 if(!list.length){$("cards").innerHTML='<div class="empty">'+(st.view==="saved"?"No saved recipes yet. Tap the heart on a recipe to keep it here.<br><br><button class=\"btn olive\" data-nav=\"home\">Browse recipes</button>":"Nothing matches. Clear the search or pick another filter.")+'</div>';return}
 $("cards").innerHTML=list.map(function(r,k){
  var i=R.indexOf(r),kc=kcalPerServe(r);
  return '<article class="card" style="animation-delay:'+Math.min(k,12)*40+'ms"><div class="visual '+GCLASS[r.g]+'" role="button" tabindex="0" data-open="'+i+'" aria-label="Open '+esc(r.n)+'"><img class="ph" src="'+photo(r)+'" alt="" loading="lazy" decoding="async">'+
   '<span class="pill time">'+esc(r.time)+'</span><div class="title">'+esc(r.n)+'</div></div><button class="pill fav" data-fav="'+i+'" aria-pressed="'+!!st.favs[r.n]+'" aria-label="Save '+esc(r.n)+'">'+I.heart+'</button>'+
   '<div class="card-foot"><div class="l"><span class="tag menu">Menu '+r.m.join(", ")+'</span><span class="tag">'+esc(r.g)+'</span>'+(r.custom?'<span class="tag custom">Custom</span>':'')+'</div>'+(kc!=null?'<span class="tag kcal">'+kc+' kcal / serve</span>':'')+'</div></article>'}).join("");
}
function drawMenu(){
 var cnt={};R.forEach(function(r){r.m.forEach(function(m){cnt[m]=(cnt[m]||0)+1})});
 var h='<div class="wrap"><table class="mt"><thead><tr><th>Menu</th><th>Program</th><th>Size</th><th>Crust</th><th>Timer</th><th>Rest</th><th>Knead</th><th>Rise</th><th>Bake</th><th>Total</th><th>Recipes</th></tr></thead><tbody>',kind="";
 MENUS.forEach(function(r){
  if(r[2]!==kind){kind=r[2];h+='<tr class="sec"><td colspan="11">'+(kind==="Bake"?"Bake programs (bread and cake)":"Dough, jam and compote programs")+'</td></tr>'}
  var raisin=RAISIN.indexOf(r[0])>=0,d=function(v){return v==="●"?'<span class="dot" title="Available"></span>':esc(v)};
  h+='<tr><td class="n">'+r[0]+'</td><td>'+esc(r[1])+(raisin?' <span class="tag menu">dispenser</span>':'')+'</td><td>'+d(r[3])+'</td><td>'+(r[4].charAt(0)==="●"?'<span class="dot"></span> '+esc(r[4].slice(1)):esc(r[4]))+'</td><td>'+d(r[5])+'</td><td>'+esc(r[6])+'</td><td>'+esc(r[7])+'</td><td>'+esc(r[8])+'</td><td>'+esc(r[9])+'</td><td>'+esc(r[10])+'</td><td>'+(cnt[r[0]]?'<button class="lnk" data-gomenu="'+r[0]+'">'+cnt[r[0]]+' recipe'+(cnt[r[0]]>1?"s":"")+'</button>':'—')+'</td></tr>'});
 h+='</tbody></table></div><p class="legend"><span class="dot"></span> means the option is available (loaf size M/L/XL, crust Light/Medium/Dark, delayed-start timer). Process times vary with room temperature. Bake only (15), Jam (26) and Compote (27) set their cooking time with the Timer pad. The raisin nut dispenser works on menus 03, 06, 14, 17, 19 and 25 and holds up to 150 g; Rye, Italian and Gluten Free do not use it. Tap a recipe count to open those recipes.</p><p class="legend"><a class="btn dark manual-btn" href="manual/SD-2501-Instructions.pdf" target="_blank" rel="noopener">Read the original manual (PDF, 48 pages)</a></p>';
 $("menu").innerHTML=h;
}
function setView(v,quiet){
 st.view=v;
 if(!quiet){try{history.replaceState(null,"",v==="home"?location.pathname:"#"+v)}catch(e){}}
 $("home").hidden=v==="menus"||v==="create";$("menu").hidden=v!=="menus";$("recipes").hidden=v==="menus"||v==="create";$("create").hidden=v!=="create";
 if(v==="create")drawCreate();
 ["home","menus","saved","create"].forEach(function(k){$("nav-"+k).setAttribute("aria-pressed",v===k)});
 var n=Object.keys(st.favs).filter(function(k){return st.favs[k]}).length;$("favn").textContent=n;$("favn").hidden=!n;
 if(v!=="menus")drawCards();
 window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
}

/* ---------- sheet ---------- */
var opener=null,closeT=null;
function openSheet(i){
 clearTimeout(closeT);st.open=i;st.tab="ing";st.step=0;st.serves=null;opener=document.activeElement;
 try{history.pushState({sheet:i},"")}catch(e){}
 var r=R[i];
 $("sheet-hero").className="sheet-hero "+GCLASS[r.g];$("sheet-hero").style.backgroundImage="url('"+photo(r)+"')";
 $("sheet-title").textContent=r.n;
 $("sheet-pills").innerHTML='<span class="t">'+esc(r.time)+'</span><span>Menu '+r.m.join(", ")+'</span><span>'+esc(r.g)+'</span><span>'+(r.timer?"Timer OK":"No delayed start")+'</span>';
 drawSheet();
 $("scrim").hidden=false;$("sheet").hidden=false;
 requestAnimationFrame(function(){$("scrim").classList.add("show");$("sheet").classList.add("show")});
 document.body.style.overflow="hidden";$("close").focus();
}
function closeSheet(fromHistory){
 if(st.open==null)return;
 $("scrim").classList.remove("show");$("sheet").classList.remove("show");document.body.style.overflow="";
 closeT=setTimeout(function(){$("scrim").hidden=true;$("sheet").hidden=true},450);st.open=null;
 if(!fromHistory&&history.state&&history.state.sheet!=null){try{history.back()}catch(e){}}
 if(opener&&opener.focus){opener.focus();opener=null}
}
/* keep Tab inside the open sheet */
document.addEventListener("keydown",function(e){
 if(e.key!=="Tab"||st.open==null)return;
 var f=$("sheet").querySelectorAll("button:not([disabled]),input,select,[tabindex]:not([tabindex=\"-1\"])");if(!f.length)return;
 var first=f[0],last=f[f.length-1];
 if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
function drawSheet(){
 var r=R[st.open],x=regionRows(r),h='';
 h+='<div class="tabs"><button aria-pressed="'+(st.tab==="ing")+'" data-tab="ing">Ingredients</button><button aria-pressed="'+(st.tab==="nut")+'" data-tab="nut">Nutrition</button><button aria-pressed="'+(st.tab==="how")+'" data-tab="how">Method</button></div>';
 if(st.tab==="ing"){
  h+='<div class="pane">';
  if(r.sz===3)h+='<div class="row"><span class="small">Loaf size</span><div class="seg-track" id="ssize">'+SIZES.map(function(s,i){return '<button aria-pressed="'+(st.size===i)+'" data-size="'+i+'">'+s+'</button>'}).join("")+'</div></div>';
  if(x.note)h+='<p class="note">'+esc(x.note)+'</p>';
  if(x.rows.length)h+='<table class="ing"><tbody>'+x.rows.map(function(g){return '<tr'+(g.late?' class="late"':'')+'><td>'+esc(g.name)+'</td><td>'+esc(g.qty)+'</td></tr>'}).join("")+'</tbody></table>';
  else h+='<p class="note">This recipe uses the dough from another recipe; see the method.</p>';
  if(x.rows.some(function(g){return g.late}))h+='<p class="small">✱ Added later: through the raisin nut dispenser, or by hand when the machine beeps.</p>';
  if(r.note)h+='<p class="note warn">'+esc(r.note)+'</p>';
  if(r.custom)h+='<div class="row"><span class="small">Your recipe, based on '+esc(r.p)+'</span><button class="btn" data-delcustom="'+esc(r.n)+'">Delete recipe</button></div>';
  h+='</div>';
 }else if(st.tab==="nut"){
  h+='<div class="pane">';
  if(!x.rows.length)h+='<p class="note">No ingredient list for this recipe, so there is nothing to calculate.</p>';
  else{
   var n=nutrition(x.rows),s=st.serves||serves(r),t=n.t,p=t.map(function(v){return v/s});
   var macroKcal=p[1]*4+p[2]*4+p[4]*9||1;
   h+='<div class="row"><span class="small">Per serving, with the batch split into</span><div class="serves"><button data-serves="-1" aria-label="Fewer servings">−</button><b>'+s+'</b><button data-serves="1" aria-label="More servings">+</button></div></div>';
   h+='<div class="nut-top"><div class="stat kcal"><b data-count="'+Math.round(p[0])+'">0</b><span>kcal per serving</span></div><div class="stat"><b data-count="'+Math.round(n.w/s)+'">0</b><span>g raw weight per serving</span></div></div>';
   h+='<div class="macros">'+[["Protein",p[1],p[1]*4/macroKcal,""],["Carbs",p[2],p[2]*4/macroKcal,"c"],["Fat",p[4],p[4]*9/macroKcal,"f"]].map(function(m){return '<div class="macro"><span>'+m[0]+'</span><div class="bar"><i class="'+m[3]+'" data-w="'+Math.round(m[2]*100)+'"></i></div><em>'+m[1].toFixed(1)+' g · '+Math.round(m[2]*100)+'%</em></div>'}).join("")+'</div>';
   var rowsN=[["Energy",p[0],t[0],"kcal",0],["Protein",p[1],t[1],"g",1],["Carbohydrate",p[2],t[2],"g",1],["of which sugars",p[3],t[3],"g",1],["Fat",p[4],t[4],"g",1],["Fibre",p[5],t[5],"g",1],["Salt",p[6]*2.5/1000,t[6]*2.5/1000,"g",2]];
   h+='<table class="nt"><thead><tr><th>Nutrient</th><th>Per serving</th><th>Whole batch</th></tr></thead><tbody>'+rowsN.map(function(q){return '<tr><td>'+q[0]+'</td><td>'+q[1].toFixed(q[4])+' '+q[3]+'</td><td>'+q[2].toFixed(q[4])+' '+q[3]+'</td></tr>'}).join("")+'</tbody></table>';
   h+='<p class="small">Estimate calculated from the listed raw ingredients (NZ quantities'+(r.sz===3?", size "+SIZES[st.size]:"")+', '+Math.round(n.w)+' g in total) using typical nutrient values per ingredient. Water lost in baking is not deducted, so values per 100 g of finished bread will be higher. Optional and "add later" items are included.</p>';
  }
  h+='</div>';
 }else{
  var steps=r.steps||[];
  h+='<div class="pane">';
  if(!steps.length){h+='<p class="note">Add the ingredients to the pan in the order listed, select menu '+r.m.join(" or ")+', and press Start. '+(r.note?esc(r.note):"Remove the bread when the machine beeps 8 times.")+'</p>'}
  else{
   h+='<div class="progress"><i style="width:'+((st.step+1)/steps.length*100)+'%"></i></div>';
   h+='<div class="steps">'+steps.map(function(_,k){return '<button aria-pressed="'+(k===st.step)+'" data-step="'+k+'" aria-label="Step '+(k+1)+'">'+(k+1)+'</button>'}).join("")+'</div>';
   h+='<p class="step-text" key="'+st.step+'">'+esc(steps[st.step])+'</p>';
   h+='<div class="step-nav"><button class="btn" data-step="'+(st.step-1)+'"'+(st.step===0?' disabled style="opacity:.4"':'')+'>Previous</button>'+(st.step<steps.length-1?'<button class="btn olive" data-step="'+(st.step+1)+'">Next step</button>':'<button class="btn dark" data-close="1">Done</button>')+'</div>';
  }
  h+='</div>';
 }
 $("sheet-body").innerHTML=h;
 /* animated numbers and bars */
 var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 Array.prototype.forEach.call($("sheet-body").querySelectorAll("[data-count]"),function(el){
  var to=+el.getAttribute("data-count"),t0=performance.now();if(reduce){el.textContent=to;return}
  (function tick(now){var k=Math.min(1,(now-t0)/700);k=1-Math.pow(1-k,3);el.textContent=Math.round(to*k);if(k<1)requestAnimationFrame(tick)})(t0);
 });
 requestAnimationFrame(function(){Array.prototype.forEach.call($("sheet-body").querySelectorAll("[data-w]"),function(el){el.style.width=el.getAttribute("data-w")+"%"})});
}


/* ---------- create a recipe ---------- */
var QUICK=[["Hemp seeds",30,"g"],["Chia seeds",20,"g"],["Pumpkin seeds",40,"g"],["Sunflower seeds",40,"g"],["Walnuts, chopped",50,"g"],["Rolled oats",40,"g"],["Grated cheese",60,"g"],["Olives, chopped",50,"g"],["Dried cranberries",60,"g"],["Chocolate chips",60,"g"],["Grated carrot",80,"g"],["Protein powder",30,"g"],["Mixed spice",1,"tsp"],["Honey",1,"tbsp"]];
var UNITS=["g","tsp","tbsp","cup","mL"];
var RAISIN_MAP={"01":"03","04":"06","13":"14","16":"17","18":"19","24":"25"};
var cr={base:null,adds:[],q:""};
function cls(name){var n=name.toLowerCase();
 if(/seed|hemp|chia|linseed|flax|poppy|sesame|pepita/.test(n))return "seed";
 if(/nut|almond|pecan|cashew|peanut/.test(n))return "nut";
 if(/dried|raisin|sultana|currant|cranberr|date|apricot|fig|prune/.test(n))return "dried";
 if(/oat|bran|quinoa|millet|psyllium|grain|flake/.test(n))return "grain";
 if(/flour|powder|cocoa|whey/.test(n))return "powder";
 if(/cheese|feta|parmesan|cheddar/.test(n))return "cheese";
 if(/choc/.test(n))return "choc";
 if(/olive|sundried|sun-dried|bacon|salami|chorizo|ham|jalape|capsicum/.test(n))return "savoury";
 if(/fresh|grated|carrot|zucchini|courgette|kumara|banana|apple|pumpkin|spinach|kale|herb|basil|rosemary|onion|garlic/.test(n))return "fresh";
 if(/honey|syrup|sugar|molasses|treacle|maple/.test(n))return "sweet";
 if(/water|milk|juice|oil|butter|egg|yog/.test(n))return "liquid";
 return "spice"}
var WHERE={seed:"dispenser",nut:"dispenser",dried:"dispenser",grain:"dispenser"};
function build(){
 var b=cr.base;if(!b)return null;
 var rows=regionRows(b).rows.map(function(r){return {name:r.name,qty:r.qty,late:r.late}});
 var adj=0,warn=[],disp=cr.adds.length>0,addW=0,coarse=0,perish=false,isBread=["Jam","Compote","Cake"].indexOf(b.g)<0;
 cr.adds.forEach(function(a){var c=cls(a.name),g=grams(a.name,a.qty+" "+a.unit).g;addW+=g;
  if(c==="grain")adj+=g;if(c==="powder")adj+=g*.8;if(/chia|psyllium/i.test(a.name))adj+=g*1.5;
  if(c==="fresh")adj-=g*.5;if(c==="cheese")adj-=g*.2;
  if(c==="fresh"||c==="cheese"||c==="liquid")perish=true;
  if(!WHERE[c])disp=false;if(c==="seed"||c==="nut")coarse+=g});
 adj=isBread?Math.round(adj/5)*5:0;
 var wi=-1;rows.forEach(function(r,i){if(wi<0&&/water/i.test(r.name)&&/ml/i.test(r.qty))wi=i});
 var waterNote="";
 if(adj&&wi>=0){var wq=rows[wi].qty.replace(/[¼½¾⅓⅔⅛]/g,""),wr=wq.match(/([\d.]+)\s*[–-]\s*([\d.]+)/),w=wr?(+wr[1]+ +wr[2])/2:parseFloat(wq);if(w){rows[wi].qty=Math.max(0,Math.round(w+adj))+" mL";waterNote=(adj>0?"Added ":"Removed ")+Math.abs(adj)+" mL of water (was "+w+" mL) because "+(adj>0?"oats, bran, chia and powders soak up liquid.":"fresh or moist add-ins release liquid.")}}
 else if(adj&&wi<0)warn.push("This base recipe has no water line to adjust, so check the dough consistency by eye.");
 var m0=b.m[0],menu=m0,where;
 var noDisp=["07","09","12","20","26","27","15","22","23"].indexOf(m0)>=0;
 if(b.g==="Jam"||b.g==="Compote"||b.g==="Cake")where="This is not a bread program, so quantities are not adjusted. Mix the add-ins in with the other ingredients.";
 else if(disp&&!noDisp){menu=RAISIN_MAP[m0]||m0;where=RAISIN.indexOf(menu)>=0?"Put the add-ins in the raisin nut dispenser. The machine drops them in at the right moment.":"Add the extras to the pan with the other ingredients."}
 else if(noDisp)where="This program does not use the raisin nut dispenser: put everything in the pan at the start.";
 else where="Moist or sticky add-ins would stick in the dispenser, so put them in the pan with the other ingredients at the start.";
 if(perish&&b.timer&&isBread)warn.push("Fresh, dairy or liquid add-ins can spoil while waiting, so the delayed-start timer is not recommended for this recipe.");
 if(addW>150)warn.push("Add-ins total "+Math.round(addW)+" g. The manual allows up to 150 g; reduce them or the loaf may not rise well.");
 if(coarse>60)warn.push("Seeds and nuts total "+Math.round(coarse)+" g. Large hard seeds can scratch the pan coating and nuts weaken the gluten, so the manual suggests keeping them modest (around 50 g).");
 var useDisp=RAISIN.indexOf(menu)>=0&&disp&&!noDisp&&b.g!=="Jam"&&b.g!=="Compote"&&b.g!=="Cake";
 cr.adds.forEach(function(a){rows.push({name:a.name,qty:a.qty+" "+a.unit,late:useDisp})});
 var mrow=MENUS.filter(function(m){return m[0]===menu})[0];
 return {rows:rows,menu:menu,where:where,warn:warn,waterNote:waterNote,time:menu===m0||!mrow?b.time:mrow[10],timer:(b.timer&&mrow&&mrow[5]==="●"&&!perish)?1:0,addW:addW};
}
function nutRows(rows){return nutrition(rows.map(function(r){return {name:r.name,qty:r.qty}}))}
function drawCreate(){
 var h='<div class="panel"><div class="section-head" style="margin:0 0 12px"><h2>Create a recipe</h2><span class="count">Step '+(cr.base?(cr.adds.length?3:2):1)+' of 3</span></div>';
 var bases=R.filter(function(c){return !c.custom});
 if(!cr.base){
  h+='<p class="small">Start from one of the manual\'s recipes. Your add-ins and the adjusted quantities build on it.</p>';
  h+='<label class="search" style="margin:10px 0"><input type="search" id="c-q" aria-label="Find a base recipe" placeholder="Find a base recipe" value="'+esc(cr.q)+'" autocomplete="off"></label><div class="pick">';
  var q=cr.q.toLowerCase();
  bases.forEach(function(r,i){if(q&&(r.n+" "+r.g).toLowerCase().indexOf(q)<0)return;h+='<button class="pickb" data-pick="'+i+'"><img src="'+photo(r)+'" alt=""><span><b>'+esc(r.n)+'</b><small>'+esc(r.g)+' · Menu '+r.m.join(", ")+' · '+esc(r.time)+'</small></span></button>'});
  h+='</div></div>';
 }else{
  var b=cr.base;
  h+='<div class="basecard"><img src="'+photo(b)+'" alt=""><div><span class="small">Based on</span><b>'+esc(b.n)+'</b><small>'+esc(b.g)+' · Menu '+b.m.join(", ")+(b.sz===3?' · size '+SIZES[st.size]:'')+'</small></div><button class="btn" data-cbase="1">Change</button></div>';
  h+='<h3>Add ingredients</h3><div class="chips wrapc">'+QUICK.map(function(q,i){return '<button class="chip" data-quick="'+i+'">+ '+esc(q[0])+'</button>'}).join("")+'</div>';
  h+='<div class="addrow"><input id="c-name" aria-label="Ingredient" placeholder="Ingredient, e.g. hemp seeds" autocomplete="off"><input id="c-qty" aria-label="Quantity" type="number" min="0" step="0.5" placeholder="Qty" inputmode="decimal"><select id="c-unit" aria-label="Unit">'+UNITS.map(function(u){return '<option>'+u+'</option>'}).join("")+'</select><button class="btn dark" data-addrow="1">Add</button></div>';
  if(cr.adds.length)h+='<ul class="adds">'+cr.adds.map(function(a,i){return '<li><span>'+esc(a.name)+'</span><b>'+a.qty+' '+a.unit+'</b><button class="rm" data-rm="'+i+'" aria-label="Remove">'+I.x+'</button></li>'}).join("")+'</ul>';
  h+='</div>';
  var out=build();
  if(out&&cr.adds.length){
   var base=nutRows(regionRows(b).rows),nw=nutRows(out.rows),s=serves(b),p0=base.t.map(function(v){return v/s}),p1=nw.t.map(function(v){return v/s});
   h+='<div class="panel result"><div class="section-head" style="margin:0 0 12px"><h2>Your recipe</h2><span class="count">'+out.rows.length+' ingredients</span></div>';
   h+='<div class="pills2"><span class="t">Menu '+out.menu+'</span><span>'+esc(out.time)+'</span><span>'+(out.timer?"Timer OK":"No delayed start")+'</span>'+(b.sz===3?'<span>Size '+SIZES[st.size]+'</span>':'')+'</div>';
   h+='<p class="note">'+esc(out.where)+'</p>';
   if(out.waterNote)h+='<p class="note">'+esc(out.waterNote)+'</p>';
   out.warn.forEach(function(w){h+='<p class="note warn">'+esc(w)+'</p>'});
   h+='<table class="ing"><tbody>'+out.rows.map(function(r){return '<tr'+(r.late?' class="late"':'')+'><td>'+esc(r.name)+'</td><td>'+esc(r.qty)+'</td></tr>'}).join("")+'</tbody></table>';
   if(out.rows.some(function(r){return r.late}))h+='<p class="small">✱ Goes in the raisin nut dispenser.</p>';
   var cmp=[["Energy",0,"kcal",0],["Protein",1,"g",1],["Carbs",2,"g",1],["Fat",4,"g",1],["Fibre",5,"g",1]];
   h+='<h3>Per serving, base vs yours</h3><table class="nt"><thead><tr><th>Nutrient</th><th>'+esc(b.n)+'</th><th>Yours</th></tr></thead><tbody>'+cmp.map(function(c){var dlt=p1[c[1]]-p0[c[1]];return '<tr><td>'+c[0]+'</td><td>'+p0[c[1]].toFixed(c[3])+' '+c[2]+'</td><td><b>'+p1[c[1]].toFixed(c[3])+' '+c[2]+'</b> <span class="dlt '+(dlt>=0?"up":"dn")+'">'+(dlt>=0?"+":"−")+Math.abs(dlt).toFixed(c[3])+'</span></td></tr>'}).join("")+'</tbody></table>';
   h+='<div class="addrow save"><input id="c-title" aria-label="Recipe name" placeholder="Name your recipe" value="'+esc(b.n+" with "+cr.adds.map(function(a){return a.name.toLowerCase().split(",")[0]}).join(", "))+'"><button class="btn olive" data-savecustom="1">Save recipe</button></div></div>';
  }
 }
 $("create").innerHTML=h;
 var cq=$("c-q");if(cq){cq.addEventListener("input",function(e){cr.q=e.target.value;var at=e.target.selectionStart;drawCreate();var n=$("c-q");n.focus();n.setSelectionRange(at,at)})}
}
function addIn(name,qty,unit){
 name=String(name||"").replace(/[|*]/g,"").replace(/\s+/g," ").trim();
 if(name.length<2||name.length>40){toast("Ingredient name: 2 to 40 characters");return}
 if(!(qty>0)||qty>2000){toast("Enter a quantity between 0 and 2000");return}
 if(UNITS.indexOf(unit)<0)unit="g";
 if(cr.adds.length>=10){toast("Up to 10 add-ins per recipe");return}
 var dup=cr.adds.filter(function(a){return a.name.toLowerCase()===name.toLowerCase()&&a.unit===unit})[0];
 if(dup){dup.qty=Math.round((dup.qty+qty)*100)/100;toast("Added to "+dup.name)}else cr.adds.push({name:name,qty:Math.round(qty*100)/100,unit:unit});
 drawCreate();var ni=$("c-name");if(ni){ni.value="";$("c-qty").value="";ni.focus()}
}
function saveCustom(){
 var out=build(),b=cr.base,name=($("c-title").value||"").replace(/[|*]/g,"").replace(/\s+/g," ").trim();
 if(name.length<2||name.length>60){toast("Recipe name: 2 to 60 characters");return}
 if(!cr.adds.length){toast("Add at least one ingredient");return}
 if(R.some(function(c){return c.n===name})){toast("A recipe with that name already exists");return}
 var rec={n:name,g:b.g,m:[out.menu],time:out.time,timer:out.timer,sz:1,custom:true,p:b.n,serves:serves(b),
  both:out.rows.map(function(r){return (r.late?"*":"")+r.name+"|"+r.qty}),
  note:out.where+(out.waterNote?" "+out.waterNote:"")+(out.warn.length?" "+out.warn.join(" "):""),
  steps:b.steps?b.steps.slice():["Put the kneading blade in the pan. Add the ingredients in the order listed"+(out.rows.some(function(r){return r.late})?", with the ✱ items in the raisin nut dispenser":"")+".","Select menu "+out.menu+(b.sz===3?", size "+SIZES[st.size]:"")+" and press Start.","When the machine beeps 8 times and the bar at ‘End’ flashes, remove the bread and leave it to cool."]};
 CUSTOM.push(rec);R.push(rec);save();drawMenu();cr={base:null,adds:[],q:""};
 toast("Saved: "+name);st.grp="All";st.menu="All";st.times=[];st.diet=[];st.src=["custom"];st.q="";$("q").value="";drawChips();setView("home");
}

/* ---------- events ---------- */
document.addEventListener("click",function(e){
 var b=e.target.closest("button,[data-open]");if(!b)return;
 var d=b.dataset;
 if(d.open!=null)return openSheet(+d.open);
 if(d.fav!=null){var fn=R[d.fav].n;st.favs[fn]=!st.favs[fn];b.setAttribute("aria-pressed",!!st.favs[fn]);save();toast(st.favs[fn]?"Saved to your recipes":"Removed from saved");var n=Object.keys(st.favs).filter(function(k){return st.favs[k]}).length;$("favn").textContent=n;$("favn").hidden=!n;if(st.view==="saved")drawCards();return}
 if(b.id==="close"||d.close)return closeSheet();
 if(d.delcustom){CUSTOM=CUSTOM.filter(function(c){return c.n!==d.delcustom});var ri=R.findIndex(function(c){return c.n===d.delcustom});if(ri>=0)R.splice(ri,1);delete st.favs[d.delcustom];save();closeSheet();drawMenu();setView(st.view,true);toast("Recipe deleted");return}
 if(d.pick){cr.base=R.filter(function(c){return !c.custom})[+d.pick]||null;cr.adds=cr.adds;return drawCreate()}
 if(d.quick){var qk=QUICK[+d.quick];return addIn(qk[0],qk[1],qk[2])}
 if(d.addrow){return addIn($("c-name").value,parseFloat($("c-qty").value),$("c-unit").value)}
 if(d.rm!=null){cr.adds.splice(+d.rm,1);return drawCreate()}
 if(d.savecustom){return saveCustom()}
 if(d.cbase){cr.base=null;cr.adds=[];return drawCreate()}
 if(d.tab){st.tab=d.tab;return drawSheet()}
 if(d.step!=null){st.step=+d.step;return drawSheet()}
 if(d.serves){st.serves=Math.max(1,(st.serves||serves(R[st.open]))+ +d.serves);return drawSheet()}
 if(d.nav)return setView(d.nav);
 if(b.id==="theme"){var cur=document.documentElement.getAttribute("data-theme"),dark=cur?cur==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",dark?"light":"dark");b.setAttribute("aria-pressed",!dark);save();return}
 if(d.gomenu){st.menu=d.gomenu;st.grp="All";st.q="";$("q").value="";drawChips();return setView("home")}
 if(d.size!=null){st.size=+d.size;st.serves=null;save()}
 else if(d.grp){st.grp=d.grp}
 else if(d.menu){st.menu=d.menu}
 else if(d.time){var i=st.times.indexOf(d.time);i<0?st.times.push(d.time):st.times.splice(i,1)}
 else if(d.diet){var j=st.diet.indexOf(d.diet);j<0?st.diet.push(d.diet):st.diet.splice(j,1)}
 else if(d.src){var si=st.src.indexOf(d.src);si<0?st.src.push(d.src):st.src.splice(si,1)}
 else if(d.clearf){st.times=[];st.diet=[];st.src=[]}
 else return;
 drawChips();if(st.open!=null)drawSheet();else drawCards();
});
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"&&st.open!=null)closeSheet();
 if((e.key==="Enter"||e.key===" ")&&e.target.dataset&&e.target.dataset.open!=null){e.preventDefault();openSheet(+e.target.dataset.open)}
});
$("scrim").addEventListener("click",closeSheet);
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&(e.target.id==="c-name"||e.target.id==="c-qty")){e.preventDefault();addIn($("c-name").value,parseFloat($("c-qty").value),$("c-unit").value)}if(e.key==="Enter"&&e.target.id==="c-title"){e.preventDefault();saveCustom()}});
$("q").addEventListener("input",function(e){st.q=e.target.value;if(st.view==="menus")setView("home");else drawCards()});

drawChips();drawMenu();
var h0=(location.hash||"").slice(1);setView(["menus","saved","create"].indexOf(h0)>=0?h0:"home");
window.addEventListener("popstate",function(){if(st.open!=null)closeSheet(true);else{var hv=(location.hash||"").slice(1),v=["menus","saved","create"].indexOf(hv)>=0?hv:"home";if(v!==st.view)setView(v,true)}});
if(history.state&&history.state.sheet!=null){try{history.replaceState(null,"")}catch(e){}}
window.addEventListener("hashchange",function(){var hv=(location.hash||"").slice(1);var v=["menus","saved","create"].indexOf(hv)>=0?hv:"home";if(v!==st.view)setView(v,true)});
document.addEventListener("keydown",function(e){if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="SELECT"){e.preventDefault();if(st.view!=="home")setView("home");$("q").focus()}});
/* swipe down to close the sheet on touch */
(function(){var y0=null,sheet=$("sheet");sheet.addEventListener("touchstart",function(e){y0=(sheet.scrollTop===0&&!window.matchMedia("(min-width:760px)").matches)?e.touches[0].clientY:null},{passive:true});sheet.addEventListener("touchmove",function(e){if(y0!=null){var dy=e.touches[0].clientY-y0;if(dy>0)sheet.style.transform="translateY("+dy+"px)"}},{passive:true});sheet.addEventListener("touchend",function(e){if(y0==null)return;var dy=e.changedTouches[0].clientY-y0;sheet.style.transform="";if(dy>110)closeSheet();y0=null})})();
})();
