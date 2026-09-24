/* ============================================================
   Religionsprøven – felles kode for lærerportal (index.html)
   og elevside (prove.html).

   Firebase-prosjekt: samme som Krøniken (krle-sim).
   Datastruktur:
     prover/{proveId}                 { eier, tittel, aktiv, visResultat, religioner[], opprettet }
     prover/{proveId}/koder/{KODE}    { nr }
     prover/{proveId}/svar/{KODE}     { kode, religion, sporsmal[10], svar[10], levert, startet, levertTid, riktige }
   Elevnavn lagres IKKE i Firebase – bare i lærerens nettleser.

   Demo: legg ?demo=1 bak adressen for å prøve alt uten Firebase.
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDazYM5XDIABscMaDFgJ1IEco0du4JAN4w",
  authDomain: "krle-sim.firebaseapp.com",
  projectId: "krle-sim",
  storageBucket: "krle-sim.firebasestorage.app",
  messagingSenderId: "1073291328318",
  appId: "1:1073291328318:web:2fa3d0e862ed8e25d24a6f"
};

const ANTALL_SPORSMAL = 10;

const RELIGIONER = {
  buddhismen:    { navn: "Buddhismen",    farge: "#E39B3A", mork: "#8a5412", lys: "#fbeed8" },
  hinduismen:    { navn: "Hinduismen",    farge: "#D9577A", mork: "#8c2442", lys: "#fbe3ea" },
  islam:         { navn: "Islam",         farge: "#3E9B6E", mork: "#1f5a3e", lys: "#dff1e7" },
  jodedommen:    { navn: "Jødedommen",    farge: "#4A6FD1", mork: "#23397a", lys: "#e0e7fa" },
  kristendommen: { navn: "Kristendommen", farge: "#C2553B", mork: "#7a2d1c", lys: "#f8e2da" }
};
const REL_NOKLER = Object.keys(RELIGIONER);
function relBilde(rel, n){ return "bilder/" + rel + "-0" + n + ".webp"; }

/* Spørsmålsbank fra Blooket-filene (20 per religion). */
const BANK = {"buddhismen":[{"s":"Hvem grunnla buddhismen?","a":["Moses","Siddhartha Gautama","Muhammad","Gandhi"],"k":0},{"s":"Hva betyr ordet «Buddha»?","a":["Den sterke","Den hellige kongen","Den oppvåknede","Den vise munken"],"k":0},{"s":"Hvor ble Siddhartha født?","a":["I Kina","I Nord-India (dagens Nepal)","I Japan","I Egypt"],"k":2},{"s":"Hva gjorde Siddhartha da han forsto at alle blir gamle, syke og dør?","a":["Bygde et større slott","Ble konge","Forlot slottet for å søke svar","Reiste til Kina"],"k":2},{"s":"Hvor satt Siddhartha da han ble Buddha?","a":["På en fjelltopp","Under et bodhi-tre","I et tempel","I en båt"],"k":0},{"s":"Hva heter Buddhas viktigste oppdagelse?","a":["De ti bud","De fem søylene","De fire edle sannhetene","De sju dagene"],"k":0},{"s":"Hva sier buddhismen at lidelse kommer av?","a":["At vi alltid vil ha mer","At gudene er sinte","At vi ikke ber nok","At vi ikke faster"],"k":1},{"s":"Hva kalles veien ut av lidelsen?","a":["Den åttedelte veien","Den hellige elva","Den store vognen","Den lange reisen"],"k":0},{"s":"Hva er nirvana?","a":["Et tempel i Tibet","En hellig bok","At grådighet, hat og forvirring slukner — full fred","Et gudebilde"],"k":1},{"s":"Hva heter de hellige tekstene i buddhismen?","a":["Vedaene","Tripitaka","Koranen","Toraen"],"k":3},{"s":"Hva betyr Tripitaka?","a":["De tre kurvene","Den hellige boka","Buddhas dagbok","De åtte hjulene"],"k":1},{"s":"Hva er det viktigste ritualet i buddhismen?","a":["Faste","Dåp","Meditasjon","Pilegrimsreise til Mekka"],"k":2},{"s":"Hva gjør munkene hver morgen?","a":["Går rundt med en bolle og får mat","Ber fem ganger","Bader i Ganges","Tenner fyrverkeri"],"k":3},{"s":"Hva heter buddhismens største høytid?","a":["Divali","Vesak","Id","Påske"],"k":3},{"s":"Hva feires under Vesak?","a":["Buddhas fødsel, oppvåkning og død","Nyttår","Munkenes nye kapper","Regntidens slutt"],"k":1},{"s":"Hva symboliserer de åtte eikene i dharmahjulet?","a":["Åtte guder","Åtte hellige byer","Stegene på den åttedelte veien","Åtte hellige bøker"],"k":2},{"s":"Hva symboliserer lotusblomsten?","a":["Rikdom","At man kan reise seg ren fra lidelsen","Krig","Solen"],"k":0},{"s":"Hva er en stupa?","a":["En hellig elv","En munkekappe","Et kuppelformet tårn med noe hellig inni","En bønnebok"],"k":0},{"s":"Hvem er Dalai Lama?","a":["Grunnleggeren av buddhismen","Lederen i tibetansk buddhisme","En hindugud","Kongen av Thailand"],"k":2},{"s":"Omtrent hvor mange buddhister finnes det i verden?","a":["5 millioner","50 millioner","500 millioner","5 milliarder"],"k":2}],"hinduismen":[{"s":"Hvem grunnla hinduismen?","a":["Moses","Buddha","Ingen – den vokste fram over lang tid","Gandhi"],"k":1},{"s":"I hvilket land oppsto hinduismen?","a":["Kina","India","Egypt","Iran"],"k":3},{"s":"Hva kommer navnet «hindu» fra?","a":["Elva Indus","Byen Delhi","Guden Vishnu","Fjellet Himalaya"],"k":1},{"s":"Hva heter de eldste hellige tekstene i hinduismen?","a":["Koranen","Bibelen","Vedaene","Toraen"],"k":2},{"s":"Hva er Brahman?","a":["Den ene guddommelige kraften bak alt","En hellig elv","En prest","En høytid"],"k":3},{"s":"Hva betyr karma?","a":["At alle guder er like","At det du gjør, kommer tilbake til deg","At man må faste","At man ber fem ganger om dagen"],"k":3},{"s":"Hva er samsara?","a":["Ringen av gjenfødelser","Et tempel","En hellig bok","En fargefest"],"k":1},{"s":"Hva er moksha?","a":["En hellig by","At sjelen slipper fri fra gjenfødelsene","Et symbol i pannen","Et gudebilde"],"k":1},{"s":"Hva heter hinduismens mest leste tekst, der Krishna snakker med Arjuna?","a":["Ramayana","Upanishadene","Bhagavadgita","Vedaene"],"k":1},{"s":"Hva kalles tilbedelsen med lys, blomster og mat?","a":["Puja","Prasad","Yoga","Dharma"],"k":2},{"s":"Hva er prasad?","a":["Et tempel","En prest","Mat som er gitt til guden og deles ut etterpå","En bønn"],"k":3},{"s":"Hva heter lysfesten, hinduismens største høytid?","a":["Holi","Divali","Navaratri","Id"],"k":1},{"s":"Hva gjør man under Holi?","a":["Faster i en måned","Kaster farget pulver på hverandre","Bader i Ganges","Tenner lamper i vinduene"],"k":0},{"s":"Hvilken gudinne ønsker man velkommen med lamper under Divali?","a":["Durga","Sarasvati","Sita","Lakshmi"],"k":1},{"s":"Hva er hinduismens viktigste symbol og lyd?","a":["Kors","Halvmåne","Om (aum)","Menora"],"k":3},{"s":"Hva symboliserer lotusblomsten?","a":["Rikdom","Sjelen som reiser seg ren fra gjørma","Krig","Solen"],"k":1},{"s":"Hva kalles den røde prikken mange hinduer har i pannen?","a":["Bindi","Tilak","Prasad","Mandir"],"k":3},{"s":"Hva heter den helligste elva i hinduismen?","a":["Nilen","Indus","Ganges","Glomma"],"k":0},{"s":"Hvilken gud har elefanthode?","a":["Vishnu","Ganesha","Shiva","Krishna"],"k":2},{"s":"Omtrent hvor mange hinduer finnes det i verden?","a":["12 millioner","120 millioner","1,2 milliarder","4 milliarder"],"k":2}],"islam":[{"s":"Hva betyr ordet «islam»?","a":["Overgivelse eller fred","Bønn","Den hellige boka","Reise"],"k":3},{"s":"Hva betyr «Allah»?","a":["Profet","Arabisk for «Gud»","Moské","Engel"],"k":3},{"s":"I hvilken by ble Muhammad født?","a":["Jerusalem","Medina","Mekka","Bagdad"],"k":3},{"s":"Hvem viste seg ifølge fortellingen for Muhammad i hulen?","a":["Engelen Gabriel","Moses","Abraham","Jesus"],"k":0},{"s":"Hvilket år regnes som år 0 i den muslimske tidsregningen?","a":["570","610","622","632"],"k":1},{"s":"Hva heter islams hellige bok?","a":["Bibelen","Toraen","Talmud","Koranen"],"k":1},{"s":"Hvilket språk er Koranen skrevet på?","a":["Arabisk","Hebraisk","Norsk","Latin"],"k":1},{"s":"Hva er hadith?","a":["Fortellinger om hva Muhammad sa og gjorde","En høytid","Et bønnehus","En fastemåned"],"k":0},{"s":"Hvor mange søyler har islam?","a":["Tre","Fem","Sju","Ti"],"k":0},{"s":"Hva heter trosbekjennelsen i islam?","a":["Salat","Zakat","Shahada","Hajj"],"k":0},{"s":"Hvor mange ganger om dagen ber muslimer?","a":["En","Tre","Fem","Sju"],"k":3},{"s":"Hvilken retning vender muslimer seg mot når de ber?","a":["Mot Jerusalem","Mot Mekka","Mot øst","Mot moskeen i Oslo"],"k":1},{"s":"Hva heter fastemåneden?","a":["Id al-fitr","Ramadan","Hajj","Sawm-dagen"],"k":0},{"s":"Hva er zakat?","a":["Å gi en del av det man eier til de fattige","Å faste","Å reise til Mekka","Å be fem ganger om dagen"],"k":2},{"s":"Hva er hajj?","a":["Fredagsbønnen","Fasten","Pilegrimsreisen til Mekka","Trosbekjennelsen"],"k":3},{"s":"Hvilken fest avslutter ramadan?","a":["Id al-adha","Id al-fitr","Hanukka","Pesach"],"k":1},{"s":"Hva er Kaba?","a":["En svart kube i Mekka som muslimer vender seg mot","Tårnet på en moské","Et bønneteppe","En hellig bok"],"k":3},{"s":"Hva kalles tårnet på en moské?","a":["Kuppel","Minaret","Nisje","Søyle"],"k":3},{"s":"Hvilken retning er den største i islam?","a":["Sjia","Sufisme","Sunni","Ingen av dem"],"k":3},{"s":"Omtrent hvor mange muslimer finnes det i verden?","a":["2 millioner","20 millioner","200 millioner","2 milliarder"],"k":3}],"jodedommen":[{"s":"Hvem inngikk ifølge fortellingen den første pakten med Gud?","a":["Moses","Abraham","Kong David","Salomo"],"k":0},{"s":"Hva fikk Moses på Sinaifjellet?","a":["Loven og de ti bud","Davidsstjernen","Toraen ferdig trykt","Nøkkelen til templet"],"k":2},{"s":"Hva kalles de fem Mosebøkene?","a":["Tanak","Talmud","Toraen","Evangeliet"],"k":3},{"s":"Hva er Tanak?","a":["Hele den hebraiske bibelen","En jødisk høytid","Rabbinerens tittel","Et hellig fjell"],"k":0},{"s":"Hva heter jødenes hviledag?","a":["Pesach","Hanukka","Jom kippur","Sabbat"],"k":2},{"s":"Når varer sabbaten?","a":["Fredag kveld til lørdag kveld","Lørdag kveld til søndag kveld","Hele søndagen","Mandag til tirsdag"],"k":2},{"s":"Hvilken mat er ikke kosher?","a":["Fisk","Svinekjøtt","Brød","Frukt"],"k":2},{"s":"Hvor gammel er man vanligvis ved bar mitsva?","a":["7 år","10 år","13 år","18 år"],"k":2},{"s":"Hvilken høytid feirer at jødene ble frie fra Egypt?","a":["Hanukka","Pesach","Jom kippur","Sabbat"],"k":0},{"s":"Hva gjør mange voksne jøder på jom kippur?","a":["Faster et helt døgn","Tenner åtte lys","Spiser usyret brød","Reiser til Roma"],"k":2},{"s":"Hvor mange dager varer hanukka?","a":["Tre","Fem","Åtte","Førti"],"k":3},{"s":"Hva er jødedommens mest kjente symbol?","a":["Korset","Halvmånen","Fisken","Davidsstjernen"],"k":3},{"s":"Hvor mange armer har en menora?","a":["Tre","Fem","Sju","Ti"],"k":1},{"s":"Hva er en kippa?","a":["En liten lue på bakhodet","En bønn","En høytid","En matrett"],"k":2},{"s":"Hva er en mesusa?","a":["En kapsel i dørkarmen med tekst fra Toraen","En sang i synagogen","Et brød man spiser på sabbaten","Et hellig fjell"],"k":1},{"s":"Hva kalles jødenes hus for bønn og læring?","a":["Kirken","Moskeen","Synagogen","Templet"],"k":2},{"s":"Hva er Vestmuren i Jerusalem?","a":["Det som er igjen av muren rundt tempelplassen","Grensen til Israel","Veggen i synagogen i Oslo","Moses' grav"],"k":3},{"s":"Hva er en rabbiner?","a":["Lærer og veileder i menigheten","Kongen i Israel","Et hellig sted","En jødisk høytid"],"k":2},{"s":"Hvilken retning i jødedommen er vanligst i Norge og Nord-Europa?","a":["Ortodoks jødedom","Konservativ jødedom","Reformjødedom","Ingen av dem"],"k":3},{"s":"Omtrent hvor mange jøder finnes det i verden?","a":["1,5 millioner","15 millioner","150 millioner","1,5 milliarder"],"k":1}],"kristendommen":[{"s":"Hva betyr «Kristus»?","a":["Den salvede","Guds venn","Læreren","Kongen av Nasaret"],"k":3},{"s":"Hvor ble Jesus født?","a":["I Nasaret","I Jerusalem","I Betlehem","I Roma"],"k":0},{"s":"Hvor vokste Jesus opp?","a":["Betlehem","Nasaret","Jerusalem","Trondheim"],"k":2},{"s":"Hva deler tidsregningen vår i f.Kr. og e.Kr.?","a":["Jesu fødsel","Jesu død","Kirkens fødsel","Slaget på Stiklestad"],"k":0},{"s":"Hvor mange disipler samlet Jesus?","a":["Sju","Ti","Tolv","Tjue"],"k":1},{"s":"Hva kalles det at Gud er Far, Sønn og Den hellige ånd?","a":["Treenigheten","Frelsen","Sakramentet","Evangeliet"],"k":2},{"s":"Hva skjedde med Jesus i Jerusalem?","a":["Han ble konge","Han ble korsfestet","Han ble prest","Han flyttet til Roma"],"k":2},{"s":"Hva tror kristne skjedde tre dager etter Jesu død?","a":["Han sto opp fra de døde","Kirken ble bygd","Bibelen ble skrevet","Disiplene dro til Norge"],"k":0},{"s":"Hva betyr «evangelium»?","a":["Hellig bok","Godt budskap","Guds hus","Stor høytid"],"k":0},{"s":"Hvilke to deler består Bibelen av?","a":["Jul og påske","Loven og profetene","Det gamle og Det nye testamentet","Salmene og bønnene"],"k":0},{"s":"Hva kalles de to viktigste ritualene, dåp og nattverd?","a":["Seremonier","Sakramenter","Symboler","Høytider"],"k":2},{"s":"Hva er den mest kjente kristne bønnen?","a":["Fadervår","Ave Maria","Trosbekjennelsen","Salme 23"],"k":0},{"s":"Hvilken høytid er den viktigste for kristne?","a":["Jul","Pinse","Påske","Advent"],"k":1},{"s":"Hva feires i pinsen?","a":["Jesu fødsel","Den hellige ånd kom til disiplene","Jesu dåp","Det siste kveldsmåltidet"],"k":3},{"s":"Hva er kristendommens viktigste symbol?","a":["Duen","Fisken","Lyset","Korset"],"k":0},{"s":"Hvorfor brukte de første kristne fisken som tegn?","a":["Det var et hemmelig tegn da de ble forfulgt","Jesus var fisker","Fisken er hellig mat","Den sto på flagget deres"],"k":0},{"s":"Hvor står Nidarosdomen?","a":["Oslo","Bergen","Trondheim","Stavanger"],"k":1},{"s":"Hvem leder den katolske kirken?","a":["Presten","Biskopen","Kongen","Paven"],"k":1},{"s":"Hvilken retning tilhører Den norske kirke?","a":["Den katolske","Den ortodokse","Den protestantiske","Den jødiske"],"k":3},{"s":"Omtrent hvor mange kristne finnes i verden?","a":["24 millioner","240 millioner","2,4 milliarder","24 milliarder"],"k":2}]};
function fasit(rel, i){ const q = BANK[rel][i]; return ((q.k - i*3 - 7) % 4 + 8) % 4; }

/* ---------- Småhjelpere ---------- */
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function $(id){ return document.getElementById(id); }
function stokk(a){ a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function tilfeldig(a){ return a[Math.floor(Math.random()*a.length)]; }
function st(id,msg,ok){ const el=$(id); if(!el)return; el.textContent=msg||""; el.className="status "+(ok===true?"ok":ok===false?"feil":""); }
function kopier(t){
  try{ navigator.clipboard.writeText(t); return; }catch(e){}
  const ta=document.createElement("textarea"); ta.value=t; document.body.appendChild(ta); ta.select();
  try{ document.execCommand("copy"); }catch(_){} ta.remove();
}
function normKode(s){ return String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,""); }
const KODE_BOKSTAV = "ABCDEFGHJKLMNPRSTUVWXYZ", KODE_SIFFER = "23456789";
function lagKoder(antall, unngaa){
  const brukt = new Set(unngaa||[]), ut=[];
  while(ut.length<antall){
    let k=""; for(let i=0;i<3;i++) k+=tilfeldig(KODE_BOKSTAV.split("")); for(let i=0;i<2;i++) k+=tilfeldig(KODE_SIFFER.split(""));
    if(!brukt.has(k)){ brukt.add(k); ut.push(k); }
  }
  return ut;
}
function riktigeAv(svarDoc){
  if(!svarDoc || !svarDoc.sporsmal) return 0;
  let n=0; svarDoc.sporsmal.forEach((qi,i)=>{ const v=(svarDoc.svar||[])[i]; if(v!=null && v===fasit(svarDoc.religion,qi)) n++; });
  return n;
}
function datoTekst(ms){ if(!ms) return ""; const d=new Date(ms); return d.toLocaleDateString("nb-NO",{day:"numeric",month:"long",year:"numeric"}); }
function lsGet(k, fallback){ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fallback; }catch(e){ return fallback; } }
function lsSet(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }

/* ============================================================
   LAGER – samme grensesnitt for Firebase og demo
   ============================================================ */
const ER_DEMO = new URLSearchParams(location.search).get("demo") === "1";

function lagFirebaseLager(){
  let auth=null, db=null, ok=false;
  try{
    if(typeof firebase!=="undefined"){
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.firestore();
      if(firebase.auth) auth = firebase.auth();
      ok = true;
    }
  }catch(e){ ok=false; }
  const P = id => db.collection("prover").doc(id);
  return {
    demo:false, klar:ok,
    onAuth(cb){ if(auth) auth.onAuthStateChanged(u=>cb(u?{uid:u.uid,email:u.email}:null)); else cb(null); },
    loginGoogle(){ return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); },
    loginEpost(e,p,ny){ return ny ? auth.createUserWithEmailAndPassword(e,p) : auth.signInWithEmailAndPassword(e,p); },
    loggUt(){ return auth.signOut(); },
    async mineProver(uid){
      const s = await db.collection("prover").where("eier","==",uid).get();
      const ut=[]; s.forEach(d=>ut.push(Object.assign({id:d.id}, d.data()))); return ut;
    },
    async nyProve(data, koder){
      const ref = db.collection("prover").doc();
      await ref.set(data);
      await this.leggTilKoder(ref.id, koder, 1);
      return ref.id;
    },
    async leggTilKoder(id, koder, startNr){
      for(let i=0;i<koder.length;i+=400){
        const b=db.batch();
        koder.slice(i,i+400).forEach((k,j)=>b.set(P(id).collection("koder").doc(k), {nr:startNr+i+j}));
        await b.commit();
      }
    },
    async hentProve(id){ const d=await P(id).get(); return d.exists ? Object.assign({id:d.id}, d.data()) : null; },
    oppdaterProve(id, patch){ return P(id).update(patch); },
    async hentKoder(id){
      const s=await P(id).collection("koder").get(); const ut=[];
      s.forEach(d=>ut.push({kode:d.id, nr:(d.data()||{}).nr||0})); ut.sort((a,b)=>a.nr-b.nr); return ut;
    },
    lyttSvar(id, cb, feil){
      return P(id).collection("svar").onSnapshot(s=>{ const ut={}; s.forEach(d=>ut[d.id]=d.data()); cb(ut); }, e=>feil&&feil(e));
    },
    nullstill(id, kode){ return P(id).collection("svar").doc(kode).delete(); },
    async slettProve(id){
      for(const sub of ["svar","koder"]){
        const s=await P(id).collection(sub).get(); const docs=[]; s.forEach(d=>docs.push(d.ref));
        for(let i=0;i<docs.length;i+=400){ const b=db.batch(); docs.slice(i,i+400).forEach(r=>b.delete(r)); await b.commit(); }
      }
      await P(id).delete();
    },
    /* elev */
    async kodeFinnes(id, kode){ try{ const d=await P(id).collection("koder").doc(kode).get(); return d.exists; }catch(e){ return false; } },
    async hentSvar(id, kode){
      try{
        const d=await P(id).collection("svar").doc(kode).get();
        return d.exists ? {status:"igang", data:d.data()} : {status:"ny"};
      }catch(e){
        if(e && e.code==="permission-denied") return {status:"levert"};
        throw e;
      }
    },
    startSvar(id, kode, data){ return P(id).collection("svar").doc(kode).set(data); },
    lagreSvar(id, kode, patch){ return P(id).collection("svar").doc(kode).update(patch); }
  };
}

function lagDemoLager(){
  const KEY="rp_demo_v1";
  const les=()=>lsGet(KEY,{prover:{}}), skriv=d=>lsSet(KEY,d);
  const lyttere=[];
  function varsle(){ lyttere.forEach(f=>f()); }
  window.addEventListener("storage", e=>{ if(e.key===KEY) varsle(); });
  function seed(){
    const d=les(); if(Object.keys(d.prover).length) return;
    const id="demo7b", koder=lagKoder(24), svar={};
    const navn=["Aksel","Amina","Ask","Ella","Emil","Filip","Hedda","Ibrahim","Ingrid","Jonas","Kasper","Leah","Linnea","Magnus","Maja","Noah","Nora","Oliver","Sara","Selma","Sofie","Theo","William","Yusuf"];
    const nm={}; koder.forEach((k,i)=>nm[k]=navn[i]); lsSet("rp_navn_"+id, nm);
    koder.forEach((k,i)=>{
      if(i>=20) return;
      const rel=tilfeldig(REL_NOKLER), sp=stokk([...Array(20).keys()]).slice(0,ANTALL_SPORSMAL);
      const levert = i<17;
      const sv = sp.map((qi,j)=> (!levert && j>4) ? null : (Math.random()<0.72 ? fasit(rel,qi) : Math.floor(Math.random()*4)));
      svar[k]={kode:k, religion:rel, sporsmal:sp, svar:sv, levert, startet:Date.now()-3600e3, levertTid: levert?Date.now()-1800e3:null};
      if(levert) svar[k].riktige = riktigeAv(svar[k]);
    });
    d.prover[id]={eier:"demo", tittel:"7B – De fem store religionene (demo)", aktiv:true, visResultat:true, religioner:REL_NOKLER.slice(), opprettet:Date.now(),
      koder: Object.fromEntries(koder.map((k,i)=>[k,{nr:i+1}])), svar};
    skriv(d);
  }
  seed();
  const kopi=o=>JSON.parse(JSON.stringify(o));
  return {
    demo:true, klar:true,
    onAuth(cb){ setTimeout(()=>cb({uid:"demo", email:"demo-lærer (ingenting lagres på nett)"}),0); },
    loginGoogle(){ return Promise.resolve(); }, loginEpost(){ return Promise.resolve(); },
    loggUt(){ location.href=location.pathname; return Promise.resolve(); },
    async mineProver(uid){ const d=les(); return Object.entries(d.prover).filter(([,p])=>p.eier===uid).map(([id,p])=>{ const x=kopi(p); delete x.koder; delete x.svar; x.id=id; return x; }); },
    async nyProve(data, koder){ const d=les(), id="p"+Date.now().toString(36); d.prover[id]=Object.assign(kopi(data),{opprettet:Date.now(),koder:{},svar:{}}); skriv(d); await this.leggTilKoder(id,koder,1); return id; },
    async leggTilKoder(id,koder,startNr){ const d=les(); koder.forEach((k,i)=>d.prover[id].koder[k]={nr:startNr+i}); skriv(d); varsle(); },
    async hentProve(id){ const p=les().prover[id]; if(!p) return null; const x=kopi(p); delete x.koder; delete x.svar; x.id=id; return x; },
    async oppdaterProve(id,patch){ const d=les(); Object.assign(d.prover[id],patch); skriv(d); },
    async hentKoder(id){ const p=les().prover[id]; return Object.entries(p.koder).map(([kode,v])=>({kode,nr:v.nr})).sort((a,b)=>a.nr-b.nr); },
    lyttSvar(id, cb){ const f=()=>{ const p=les().prover[id]; cb(p?kopi(p.svar):{}); }; lyttere.push(f); f(); const t=setInterval(f,2000); return ()=>{ clearInterval(t); const i=lyttere.indexOf(f); if(i>=0) lyttere.splice(i,1); }; },
    async nullstill(id,kode){ const d=les(); delete d.prover[id].svar[kode]; skriv(d); varsle(); },
    async slettProve(id){ const d=les(); delete d.prover[id]; skriv(d); try{ localStorage.removeItem("rp_navn_"+id); }catch(e){} },
    async kodeFinnes(id,kode){ const p=les().prover[id]; return !!(p && p.koder[kode]); },
    async hentSvar(id,kode){ const s=les().prover[id].svar[kode]; if(!s) return {status:"ny"}; if(s.levert) return {status:"levert"}; return {status:"igang", data:kopi(s)}; },
    async startSvar(id,kode,data){ const d=les(); if(!d.prover[id].aktiv) throw {code:"permission-denied"}; d.prover[id].svar[kode]=kopi(data); skriv(d); varsle(); },
    async lagreSvar(id,kode,patch){ const d=les(); const s=d.prover[id].svar[kode]; if(!s||s.levert||!d.prover[id].aktiv) throw {code:"permission-denied"}; Object.assign(s,kopi(patch)); skriv(d); varsle(); }
  };
}

const Lager = ER_DEMO ? lagDemoLager() : lagFirebaseLager();
