function aa(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}function m(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:aa(a)}}function ba(a){if(!(a instanceof Array)){a=m(a);for(var b,d=[];!(b=a.next()).done;)d.push(b.value);a=d}return a}var ca="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,d){if(a==Array.prototype||a==Object.prototype)return a;a[b]=d.value;return a};
function da(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var d=a[b];if(d&&d.Math==Math)return d}throw Error("Cannot find global object");}var ea=da(this);function n(a,b){if(b)a:{var d=ea;a=a.split(".");for(var e=0;e<a.length-1;e++){var f=a[e];if(!(f in d))break a;d=d[f]}a=a[a.length-1];e=d[a];b=b(e);b!=e&&null!=b&&ca(d,a,{configurable:!0,writable:!0,value:b})}}
n("Array.prototype.findIndex",function(a){return a?a:function(b,d){a:{var e=this;e instanceof String&&(e=String(e));for(var f=e.length,c=0;c<f;c++)if(b.call(d,e[c],c,e)){b=c;break a}b=-1}return b}});n("Object.values",function(a){return a?a:function(b){var d=[],e;for(e in b)Object.prototype.hasOwnProperty.call(b,e)&&d.push(b[e]);return d}});
n("Array.prototype.fill",function(a){return a?a:function(b,d,e){var f=this.length||0;0>d&&(d=Math.max(0,f+d));if(null==e||e>f)e=f;e=Number(e);0>e&&(e=Math.max(0,f+e));for(d=Number(d||0);d<e;d++)this[d]=b;return this}});function p(a){return a?a:Array.prototype.fill}n("Int8Array.prototype.fill",p);n("Uint8Array.prototype.fill",p);n("Uint8ClampedArray.prototype.fill",p);n("Int16Array.prototype.fill",p);n("Uint16Array.prototype.fill",p);n("Int32Array.prototype.fill",p);
n("Uint32Array.prototype.fill",p);n("Float32Array.prototype.fill",p);n("Float64Array.prototype.fill",p);
function q(a,b,d,e,f){e=void 0===e?50:e;f=void 0===f?50:f;a.x=void 0===b?0:b;a.y=void 0===d?0:d;a.width=e;a.height=f;a.o=e/2;a.D=f/2;a.wa=1;a.$=1;a.ha=.5;a.ia=.5;a.rotation=0;a.alpha=1;a.B=!1;a.visible=!0;a.children=[];a.parent=void 0;a.ib=void 0;a.g=function(c){c.parent&&c.parent.removeChild(c);c.parent=a;a.children.push(c)};a.removeChild=function(c){c.parent===a&&a.children.splice(a.children.indexOf(c),1)};Object.defineProperties(a,{m:{get:function(){return a.x+(a.parent?a.parent.m:0)}},i:{get:function(){return a.y+
(a.parent?a.parent.i:0)}},u:{get:function(){return a.m+a.o}},v:{get:function(){return a.i+a.D}},bottom:{get:function(){return a.y+a.parent.i}}})}
function fa(a,b,d,e){b=void 0===b?0:b;ha(a,void 0===d?0:d,void 0===e?0:e);a.speed=2;a.K=ia(5);a.Z=ia(30);a.head=ja();b&&(a.mb=ka(),a.head.g(a.mb));a.j={};q(a.j,0,0,1,1);a.j.l=!0;a.J=a.j;a.G=!1;a.sa=0;a.Fa=!1;a.Y=!1;a.ca=.5;a.Ba=!0;a.Ga=!0;a.g(a.K);a.K.y=a.height-a.K.height;a.g(a.Z);a.Z.y=a.height-a.Z.height;a.g(a.head);a.W=t(a.H/a.S*100*a.ca,5,"Yellow");a.g(a.W);a.W.y=-10;a.R=t(a.H/a.S*100*a.ca,5,"green");a.g(a.R);a.R.y=-10;a.R.visible=!1;a.W.visible=!1;a.ub=function(f){f.forEach(function(c){u.P(a,
c)<a.Ia&&(a.target=c,v.push(a))})};a.nb=function(){a.Ua||(a.Ua=!0,a.Ga&&(a.Ba=!0,a.Ga=!1,a.head.y=0,a.K.y=a.height-a.K.height,a.Z.y=a.height-a.Z.height,a.va=0,a.ga=1),"main"==a.type&&(a.hb.y=a.F.y),a.F.y=a.head.y+("villager"==a.type?8:0),a.head.y+=a.ga,a.va+=a.ga,2<=a.va?--a.ga:-2>=a.va&&(a.ga+=1),u.wait(50,function(){return a.Ua=!1}))};a.qb=function(){a.Wa||(a.Wa=!0,a.Ba&&(a.Ba=!1,a.Ga=!0,a.head.y=0,a.ua=0,a.T=5,a.Xa=0,a.Ya=0,a.Za=0),a.Za=a.Ya,a.Ya=a.Xa,a.Xa=a.K.y,a.ua+=a.T,a.K.y-=a.T,a.Z.y=a.Za,
a.head.y=-Math.abs(a.T)-7,a.F.y=a.head.y+("villager"==a.type?10:0),"main"==a.type&&(a.hb.y=a.F.y),15<=a.ua?a.T-=5:15>=a.ua&&(a.T+=5),u.wait(20,function(){return a.Wa=!1}))};a.ta=function(f){a.H-=f;0>=a.H?(a.Y=!0,u.remove(a),x(z,a),x(v,a),"invader"==a.type?x(A,a):(x(B,a),x(la,a))):(a.sa+=f*a.ca,a.R.width=a.H/a.S*100*a.ca,C&&(a.R.width=a.H/a.S*100*a.ca),a.Fa||(a.Fa=!0,a.Ra()),a.head.fillStyle="#FFF",u.wait(80,function(){return a.head.fillStyle="#555"}))};a.Ra=function(){0<a.sa?u.wait(2,function(){a.W.width-=
100/a.S;--a.sa;a.Ra()}):a.Fa=!1}}function ma(a,b,d,e){var f=void 0===f?50:f;var c=void 0===c?50:c;fa(a,void 0===b?1:b,void 0===d?0:d,void 0===e?0:e);a.border=na(f,c);a.g(a.border);a.border.x-=a.o;a.border.y-=a.D;a.border.visible=!1;a.select=function(){D.push(a);a.border.visible=!0;a.R.visible=!0;a.W.visible=!0};a.Sa=function(){a.border.visible=!1;a.R.visible=!1;a.W.visible=!1}}
function ha(a,b,d,e,f){b=void 0===b?0:b;d=void 0===d?0:d;a.speed=2;a.M=0;a.N=0;a.ea=b;a.fa=d;a.Ka=!1;a.I=!1;a.L=[];a.pb=!1;a.Cb=!1;a.Da=!1;a.Ea=!1;a.Eb=!1;a.xb=!1;a.yb=!1;a.Ab=!1;a.da=null;a.jb=null;a.move=function(){var c=a.ea-a.x;var g=Math.abs(c);a.Ea?(a.x+=a.M*a.speed,c=void 0):g>a.speed?(a.x+=a.M*a.speed,0<a.L.length&&0!=c&&oa(a,1),a.V(),c=!0):c=!1;g=pa(a);c||g||(x(E,a),a.I=!1)};a.V=function(){qa(a)};q(a,b,d,void 0===e?50:e,void 0===f?50:f)}
function ra(){var a=200,b=180;a=void 0===a?0:a;b=void 0===b?0:b;var d,e=sa(),f=ta(),c=t(2,140,"#FFF",0,0),g=t(4,40,"#0F0"),k=ua(1),l=ua(0),h={type:"main",H:500,S:500,ra:0,F:e,hb:f,gb:g,Fb:c,eb:k,fb:l,aa:3,ja:va,sb:10,Ja:10,zb:!1,attack:function(){d=-F(h.j,u.A);h.G||h.qa?h.qa||(h.qa=!0,h.gb.rotation=d+va,h.Pa(I(23,36)),h.fb.visible=!0,u.wait(40,function(){return h.fb.visible=!1}),u.wait(70,function(){return h.qa=!1})):(h.G=!0,h.gb.rotation=d+wa,h.rotation=0,h.Pa(I(14,25)),h.eb.visible=!0,u.wait(40,
function(){return h.eb.visible=!1}),u.wait(150,function(){return h.G=!1}))},Pa:function(r){for(var K=m(A),w=K.next();!w.done;w=K.next())if(w=w.value,175>=u.P(h.j,w)){var y=-F(h.j,u.A);y+=2*J*(0>y);var G=-F(h.j,w);G+=2*J*(0>G);y-=G;if(1.14>=Math.abs(y>J?2*J-y:y<-J?2*J+y:y)&&"dead"===w.ta(r))for(x(A,w),w.Y=!0,y=I(2,6),G=0;G<y;G++){var H=xa(15,"#900");L.g(H);H.x=w.x+I(-50,50);H.y=w.y+I(-50,50);H.H=3;H.Db=I(7,17);ya.push(H)}}},bb:function(){return za(h,h.M,h.N)}};ma(h,1,a,b);a=h.j;h.g(e);h.g(f);f.g(a);
a.g(g);g.x=-1;g.y=-21;g.g(c);c.x=g.o-c.o;c.y=g.height;a.l=!0;g.l=!0;c.l=!0;h.l=!0;c.g(k);k.x=-24.5;k.y=-25.5;c.g(l);l.x=-23.5;l.y=-25.5;c.$*=-1;g.rotation=h.aa;h.J=g;a.x=-1;a.y=28;return h}
function Aa(a,b,d){a=void 0===a?0:a;b=void 0===b?0:b;d=void 0===d?!1:d;var e=sa(0,8),f={type:"villager",H:100,S:100,ra:20,Ia:400,F:e,ja:J/2+.1,aa:.4,target:null,attack:function(c){c=void 0===c?u.A:c;if(d&&!f.G){f.G=!0;if(f==M){var g=I(-40,40);var k=I(-35,35);var l=10}else g=I(-60,60),k=I(-60,60),l=500,f.J.rotation=-F(f.j,c,f.oa,f.pa)+f.ja;var h=Ba(c.u-5+g+-N.x,c.v-5+k+-N.y);N.g(h);Ca.push(h);f.J.lb();f==M?0<A.length&&A.forEach(function(r){u.P(h,r)<r.o+5&&r.ta(f.ra)}):u.P(h,c)<c.o+5&&c.ta(24);u.wait(170,
function(){u.remove(h);x(Ca,h)});u.wait(l,function(){f.G=!1})}}};ma(f,0,a,b);f.g(e);f.F.g(f.j);d&&Da(f);f.oa=-25;f.pa=-40;B.l=!0;return f}
function Ea(a){var b={type:"invader",S:100,H:100,ra:10,Ia:700,ja:J/2,aa:J,target:null,attack:function(d){b.G||(u.P(b,d)>b.Ia?b.target=null:(b.G=!0,b.J.rotation=-F(b.j,d,b.oa,b.pa)+b.ja,b.Ha.vb(u.P(b,d)),b.Ha.l=!0,b.l=!0,b.j.l=!0,b.F.l=!0,d.ta(b.ra),u.wait(50,function(){b.Ha.l=!1;b.l=!1;b.j.l=!1;b.F.l=!1}),u.wait(800,function(){return b.G=!1})))}};fa(b,0,void 0===a?0:a,350);b.F=Fa();b.g(b.F);b.F.g(b.j);b.j.width=50;b.j.height=50;Da(b,!1);b.oa=-23;b.pa=-40;return b};function F(a,b,d,e){return Math.atan2(b.u+(void 0===d?0:d)-a.u,b.v+(void 0===e?0:e)-a.v)}function oa(a,b){a.L.forEach(function(d){if(u.Ca(a,d)){var e=a.ea+N.x,f=a.fa+N.y,c=d.u,g=d.v;void 0==a.da&&(a.da=d,Math.abs(e-c)<=d.o+50&&Math.abs(f-g)<=d.D+50&&(a.ea=a.x,a.fa=a.y));b?(a.Da=!0,a.x-=a.M*a.speed,a.N=f>g?.9:-.9):(a.Ea=!0,a.y-=a.N*a.speed,a.M=e>c?.9:-.9)}else d==a.da&&(a.da=void 0,b?a.Da=!1:a.Ea=!1,a.xb=!1,a.yb=!1,d=a.ea-a.x,e=a.fa-a.y,f=Math.sqrt(Math.pow(d,2)+Math.pow(e,2)),a.M=d/f,a.N=e/f)})}
function O(a){var b=void 0===b?M:b;b.L&&b.L.forEach(function(d){if(u.Ca(b,d))switch(b.da=d,b.jb=a,a){case "top":b.y=d.y-b.height-1;break;case "bot":b.y=d.y+d.height+1;break;case "left":b.x=d.x-b.width-1;break;case "right":b.x=d.x+d.width+1}})}function I(a,b,d){a=Math.random()*(b-a)+a;return void 0===d||d?Math.floor(a):a}function x(a,b){b=a.indexOf(b);-1!==b&&a.splice(b,1)}function Ga(){var a=M,b=u.A;var d=b.u-a.u;a=b.v-a.v;b=Math.sqrt(Math.pow(d,2)+Math.pow(a,2));return{x:d/b,y:a/b}}
function Ha(){var a=D,b=u.A.x-N.x,d=u.A.y-N.y,e=E,f=a.length;if(0!=f){for(var c=Math.floor(Math.sqrt(f)),g=1;g<c;)if((f-g)%c!==c-1)g++;else break;a.sort(function(G,H){return H.width-G.width});var k=a[0].width,l=a[0].height,h=(b+(f-g)%c*(k+4)+k-b)/2;f=(d+Math.floor((f-g)/c)*(l+4)+l-d)/2;g={};for(var r in a){g.C=a[r];g.C.pb=!1;g.C.target=null;var K=b+r%c*(k+20)-h,w=d+Math.floor(r/c)*(l+10)-f;g.C.ea=K;g.C.fa=w;K-=g.C.x;w-=g.C.y;var y=Math.sqrt(Math.pow(K,2)+Math.pow(w,2));g.C.M=K/y;g.C.N=w/y;-1==e.findIndex(function(G){return function(H){return H==
G.C}}(g))&&(g.C.I=!0,e.push(g.C));g={C:g.C}}}}function pa(a){P.children.sort(function(e,f){return e.bottom-f.bottom});var b=a.fa-a.y,d=Math.abs(b);if(a.Da)a.y+=a.N*a.speed;else return d>a.speed?(a.y+=a.N*a.speed,0<a.L.length&&0!=b&&oa(a,0),a.V(),!0):!1}
function qa(a){var b=void 0===b?400:b;var d=void 0===d?400:d;if(!a.Ka){a.Ka=!0;for(var e={},f=m(Ia),c=f.next();!c.done;e={O:e.O},c=f.next())e.O=c.value,Math.abs(e.O.u-a.u)<d&&Math.abs(e.O.v-a.v)<d?-1==a.L.findIndex(function(g){return function(k){return k==g.O}}(e))&&a.L.push(e.O):x(a.L,e.O);u.wait(b,function(){return a.Ka=!1})}}
function za(a,b,d){0<a.Ja?u.wait(1,function(){a.rotation+=.625;a.x+=b*a.speed*12.5;0<b?O("left"):0>b&&O("right");a.y+=d*a.speed*12.5;0<d?O("top"):0>d&&O("bot");--a.Ja;a.bb()}):(a.Ja=a.sb,a.rotation=0,a.Va=!1)};var Q={w:!1,s:!1,a:!1,d:!1};window.addEventListener("keydown",function(a){a.key in Q&&(Q[a.key]=!0,C&&(M.I=!0))});window.addEventListener("keyup",function(a){a.key in Q?(Q[a.key]=!1,C&&Object.values(Q).every(function(b){return!1===b})&&(M.I=!1)):"r"===a.key&&Ja()});
function Ka(){Q.w&&(M.y-=M.speed,O("bot"),M.V(),P.children.sort(function(a,b){return a.bottom-b.bottom}));Q.tb&&(M.y+=M.speed,O("top"),M.V(),P.children.sort(function(a,b){return a.bottom-b.bottom}));Q.a&&(M.x-=M.speed,O("right"),M.V());Q.d&&(M.x+=M.speed,O("left"),M.V())};var R,S,La;function Ma(){if(u.A.y>u.B.height-100)return!0}
function Na(){if(C)"main"!=M.type||M.cb||(M.cb=!0,a=Ga(),M.M=a.x,M.N=a.y,b=[],0<a.x?b.push("left"):b.push("right"),0<a.y?b.push("top"):b.push("down"),M.Va=!0,M.V(),M.bb(),u.wait(200,function(){return M.cb=!1}));else if(!Ma()&&0<D.length){if(0<A.length)for(var a={},b=m(A),d=b.next();!d.done;a={ka:a.ka,ba:a.ba},d=b.next())if(a.ba=d.value,25>=u.P(a.ba,u.A)){a.ka=Oa();a.ba.g(a.ka);u.wait(300,function(e){return function(){return u.remove(e.ka)}}(a));D.forEach(function(e){return function(f){f.I=!1;f.target=
e.ba;v.push(f)}}(a));return}Ha()}}function Pa(){if(S){D.forEach(function(e){return e.Sa()});D.length=0;var a=R.ma,b=R.la,d=t(a?Math.abs(a):1,b?Math.abs(b):1,"#FFF",0,0>a?R.m+a:R.m,0>b?R.i+b:R.i);u.B.g(d);B.forEach(function(e){u.Ca(d,e,!0)&&-1==D.findIndex(function(f){return f==e})&&e.select()});S=!1;R.alpha=0;La=!1;u.wait(80,function(){return u.remove(d)})}}function Qa(){if(S){La||(R.x=u.A.x,R.y=u.A.y,La=!0);var a=u.A.y-R.y;R.ma=u.A.x-R.x;R.la=a}};var Ra=Math.PI/180,J=Math.PI,va=-60*Ra,wa=60*Ra,M,Sa,C=!1,T,B=[],u,N,U,L,P,z=[],la=[],D=[],E=[],Ia=[],A=[],ya=[],Ca=[],v=[],Ta=!1,V,W,X,Ua,Va=[],Wa,Xa,Ya,Za;function $a(){z.forEach(function(a){a.I?a.qb():a.nb()})}function ab(){0<E.length&&!Ta&&(Ta=!0,E.forEach(function(a){a.I?a.move():x(E,a)}),u.wait(8,function(){return Ta=!1}))}function bb(a,b){a.forEach(function(d){d.target||d.ub(b)});u.wait(4E3,function(){return!0})}
function Ja(){C?(C=!1,[V,W,X].forEach(function(a){return a.visible=!1}),M.Y||(M.I=!1,M.J.rotation=M.aa,M=null)):1===D.length&&(C=!0,M=D[0],M.I=!1,x(E,M),x(v,M),M.Sa(),D=[],[V,W,X].forEach(function(a){return a.visible=!0}))}
function cb(){C?(M.Y&&Ja(),Y.x=.5*(u.A.x+M.m+M.o),Y.x=.5*(M.m+M.o+Y.x),N.x-=.175*(Y.x-db)+.01,Y.y=.5*(u.A.y+M.i+M.D),Y.y=.5*(M.i+M.D+Y.y),N.y-=.175*(Y.y-eb)+.01,M.G||M.qa||M.Va||(Ka(),M.J.rotation=-F(M.j,u.A,M.oa,M.pa)+M.ja)):(Qa(),Q.w&&300>N.y&&(N.y+=10),Q.tb&&N.y>u.B.height-1E3&&(N.y-=10),Q.a&&0>N.x&&(N.x+=10),Q.d&&N.x>u.B.width-2400&&(N.x-=10));$a();ab();0<Ca.length&&Ca.forEach(function(a){a.wa+=.1;a.$+=.1});0<v.length&&v.forEach(function(a){!a.target||a.Y||a.target.Y?(x(v,a),a.target=null,u.wait(200,
function(){return a.J.rotation=a.aa})):a.attack(a.target)});bb(la,A);bb(A,B)}function fb(){T||(T=document.getElementById("c"),T.addEventListener("contextmenu",function(a){return a.preventDefault()}),T.addEventListener("pointerdown",function(a){0===a.button?C?M.attack():Ma()||(S=!0,R.alpha=1):2===a.button&&Na()}),T.addEventListener("pointerup",function(a){C?a=!1:(0===a.button&&Pa(),a=void 0);return a}))}
function gb(){for(var a=4,b=Ua.height/100,d=Ua.width/100,e=0;e<b;e++){Va.push([]);for(var f=0;f<d;f++){var c=100*f+50,g=100*e+50;2>e?8<f&&12>f&&0==e&&10==f&&(Va[e].push([7,c,g]),c=t(100,100,"#321",2,c-50,g-50),L.g(c),g=hb(100*f,100*e),P.g(g),Ia.push(g),c.alpha=.5):.2>=Math.random()?(Va[e].push([0,c,g]),.2>=Math.random()&&a&&(c=Aa(c-25,c-25),P.g(c),B.push(c),z.push(c),c.speed=2,--a)):1==e%2&&(.5<Math.random()?ib(100*f,100*e+I(-100,100)):0==f%2&&(Va[e].push([3,c,g]),c=I(5,25),jb(c,100*f+1.5*c+I(-35,
35),100*e+1.5*c+I(-35,35))))}}}function kb(){V=t(400,5,"black",8,100,20);V.strokeStyle="darkgray";W=t(400,5,"Yellow",0,100,20);X=t(400,5,"red",0,100,20);U.g(V);U.g(W);U.g(X);[V,W,X].forEach(function(a){return a.visible=!1})}
u=function(a){function b(){requestAnimationFrame(b,f.canvas);if(void 0===f.La)f.state&&!f.paused&&f.state(),f.h(f.canvas,0);else{var c=Date.now(),g=c-f.Ma;1E3<g&&(g=f.na);f.Ma=c;for(f.X+=g;f.X>=f.na;)d(),f.state&&!f.paused&&f.state(),f.X-=f.na;f.h(f.canvas,f.X/f.na)}}function d(){function c(g){g.za=g.x;g.Aa=g.y;g.children&&0<g.children.length&&g.children.forEach(function(k){return c(k)})}f.B.children.forEach(function(g){return c(g)})}function e(c,g,k,l,h){l=void 0===l?50:l;h=void 0===h?50:h;c.x=void 0===
g?0:g;c.y=void 0===k?0:k;c.width=l;c.height=h;c.o=l/2;c.D=h/2;c.wa=1;c.$=1;c.ha=.5;c.ia=.5;c.rotation=0;c.alpha=1;c.B=!1;c.visible=!0;c.children=[];c.parent=void 0;c.ib=void 0;c.g=function(r){r.parent&&r.parent.removeChild(r);r.parent=c;c.children.push(r)};c.removeChild=function(r){r.parent===c&&c.children.splice(c.children.indexOf(r),1)};Object.defineProperties(c,{m:{get:function(){return c.x+(c.parent?c.parent.m:0)}},i:{get:function(){return c.y+(c.parent?c.parent.i:0)}},u:{get:function(){return c.m+
c.o}},v:{get:function(){return c.i+c.D}},bottom:{get:function(){return c.y+c.parent.i}}})}var f={};f.canvas=document.getElementById("c");f.canvas.style.backgroundColor="black";f.canvas.kb=f.canvas.getContext("2d");f.B=function(){var c={};e(c,0,0,f.canvas.width,f.canvas.height);c.B=!0;c.parent=void 0;return c}();f.A=function(){var c={Na:0,Oa:0};Object.defineProperties(c,{x:{get:function(){return c.Na/f.scale}},y:{get:function(){return c.Oa/f.scale}},m:{get:function(){return c.x}},i:{get:function(){return c.y}},
o:{get:function(){return 0}},D:{get:function(){return 0}},u:{get:function(){return c.x}},v:{get:function(){return c.y}}});c.rb=function(g){c.Na=g.pageX-g.target.offsetLeft;c.Oa=g.pageY-g.target.offsetTop;g.preventDefault()};f.canvas.addEventListener("mousemove",c.rb.bind(c),!1);return c}();f.state=void 0;f.wb=a;f.paused=!1;f.La=60;f.Ma=Date.now();f.na=1E3/f.La;f.X=0;f.ob=!0;f.scale=1;f.h=function(c,g){function k(h){if(h.l||h.visible&&h.m<c.width+h.width&&h.m+h.width>=-h.width&&h.i<c.height+h.height&&
h.i+h.height>=-h.height)l.save(),f.ob?(h.$a=void 0!==h.za?(h.x-h.za)*g+h.za:h.x,h.ab=void 0!==h.Aa?(h.y-h.Aa)*g+h.Aa:h.y):(h.$a=h.x,h.ab=h.y),l.translate(h.$a+h.width*h.ha,h.ab+h.height*h.ia),l.globalAlpha=h.alpha,l.rotate(h.rotation),l.scale(h.wa,h.$),h.h&&h.h(l),h.children&&0<h.children.length&&(l.translate(-h.width*h.ha,-h.height*h.ia),h.children.forEach(function(r){return k(r)})),l.restore()}var l=c.kb;l.clearRect(0,0,c.width,c.height);f.B.children.forEach(function(h){return k(h)})};f.start=function(){f.wb();
b()};f.pause=function(){return f.paused=!0};f.resume=function(){return f.paused=!1};f.remove=function(c){var g=Array.prototype.slice.call(arguments);if(g[0]instanceof Array){var k=g[0];k.forEach(function(l){l.parent.removeChild(l);k.splice(k.indexOf(l),1)})}else 1<g.length?g.forEach(function(l){return l.parent.removeChild(l)}):g[0].parent.removeChild(g[0])};f.group=function(c){var g={};e(g);g.g=function(k){k.parent&&k.parent.removeChild(k);k.parent=g;g.children.push(k);g.Qa()};g.removeChild=function(k){k.parent==
g&&g.children.splice(g.children.indexOf(k),1);g.Qa()};g.Qa=function(){0<g.children.length&&(g.ya=0,g.xa=0,g.children.forEach(function(k){k.x+k.width>g.ya&&(g.ya=k.x+k.width);k.y+k.height>g.xa&&(g.xa=k.y+k.height)}),g.width=g.ya,g.height=g.xa)};f.B.g(g);c&&Array.prototype.slice.call(arguments).forEach(function(k){return g.g(k)});return g};f.wait=function(c,g){return setTimeout(g,c)};f.Ca=function(c,g,k){if(void 0===k?0:k){var l=c.m+c.o-(g.m+g.o);var h=c.i+c.D-(g.i+g.D)}else l=c.u-g.u,h=c.v-g.v;k=c.o+
g.o;c=c.D+g.D;return Math.abs(l)<k?Math.abs(h)<c?!0:!1:!1};f.Bb=function(c,g){var k=g.U?"circle":"rectangle";if("rectangle"===k){var l=g.m;var h=g.m+g.width;var r=g.i;var K=g.i+g.height;l=c.x>l&&c.x<h&&c.y>r&&c.y<K}"circle"===k&&(k=c.x-g.u,c=c.y-g.v,c=Math.sqrt(k*k+c*c),l=c<g.U);return l};f.P=function(c,g){return Math.sqrt(Math.pow(g.u-(c.u+0),2)+Math.pow(g.v-(c.v+0),2))};return f}(function(){Ya=t(u.B.width,100,"#533",10,0,u.B.height-100);fb();Wa=xa(130,"orange",!1,500,-250);Xa=lb();Ua=mb();L=u.group();
P=u.group();N=u.group(Wa,Xa,Ua,L,P);Za=u.group();U=u.group(Za,Ya);gb();Sa=ra();P.g(Sa);B.push(Sa);z.push(Sa);for(var a=0;4>a;a++){var b=Aa(100,400+55*a,!0);P.g(b);B.push(b);z.push(b);la.push(b)}for(a=0;4>a;a++)b=Ea(1400+50*a),P.g(b),z.push(b),A.push(b);La=S=!1;R=nb();R.alpha=0;U.g(R);kb();P.children.sort(function(d,e){return d.bottom-e.bottom});db=u.B.width/2;eb=u.B.height/2;Y=t(1,1,"",0);Y.alpha=0;u.state=cb});u.start();var Z=Math.PI;function xa(a,b,d,e,f){e=void 0===e?0:e;f=void 0===f?0:f;var c={fillStyle:b,U:a/2,h:function(g){g.strokeStyle="black";g.lineWidth=0;g.fillStyle=c.fillStyle;g.beginPath();g.arc(c.U+2*-c.U*c.ha,c.U+2*-c.U*c.ia,c.U,0,2*Z,!1);g.fill()}};(void 0===d?0:d)?ha(c,a,a,e,f):q(c,a,a,e,f);return c}
function t(a,b,d,e,f,c){e=void 0===e?1:e;f=void 0===f?0:f;c=void 0===c?0:c;var g={x:f,y:c,width:a,height:b,fillStyle:d,strokeStyle:"black",h:function(k){k.strokeStyle=g.strokeStyle;k.lineWidth=e;k.fillStyle=g.fillStyle;k.beginPath();k.moveTo(f,c);k.rect(-g.width*g.ha,-g.height*g.ia,g.width,g.height);k.fill();e&&k.stroke()}};q(g,f,c,a,b);return g}
function nb(){var a={ma:1,la:1,h:function(b){b.strokeStyle="#FFF";b.lineWidth=4;b.beginPath();b.rect(a.ma,a.la,-a.ma,-a.la);b.stroke()}};q(a,0,0,1,1);return a}function ua(a){var b={h:function(d){d.fillStyle="#fff";a?(d.beginPath(),d.arc(0,160,160,1.5*Z,.165*Z,!1),d.arc(65,195,85,.165*Z,1.225*Z,!0)):(d.beginPath(),d.arc(0,160,160,1.5*Z,.835*Z,!0),d.arc(-65,195,85,.835*Z,1.772*Z,!1));d.fill()}};q(b,0,0);b.visible=!1;return b}
function sa(a,b){var d={h:function(e){e.lineJoin="round";e.strokeStyle="#000";e.fillStyle="red";e.lineWidth=.7;e.beginPath();e.moveTo(-18,-10);e.lineTo(-4,0);e.lineTo(-18,-5);e.lineTo(-18,-10);e.fill();e.moveTo(18,-10);e.lineTo(4,0);e.lineTo(18,-5);e.lineTo(18,-10);e.fill();e.stroke()}};q(d,void 0===a?0:a,void 0===b?0:b);return d}
function ta(){var a={h:function(b){b.strokeStyle="#000";b.fillStyle="red";b.lineWidth=.8;b.beginPath();b.moveTo(-3,-18);b.lineTo(3,-18);b.lineTo(0,-3);b.lineTo(-3,-18);b.fill();b.stroke()}};q(a);return a}function ia(a){var b={h:function(d){d.strokeStyle="#000";d.fillStyle="#555";d.lineWidth=1;d.beginPath();d.moveTo(0,0);d.lineTo(6,0);d.lineTo(6,4);d.lineTo(0,4);d.lineTo(0,0);d.fill();d.stroke()}};q(b,a,0,7,5);return b}
function na(a,b){var d={h:function(e){e.strokeStyle="#FFF";e.lineWidth=2;e.beginPath();e.moveTo(0,0);e.lineTo(a/4,0);e.moveTo(a-a/4,0);e.lineTo(a,0);e.lineTo(a,a/4);e.moveTo(a,b-a/4);e.lineTo(a,b);e.lineTo(a-a/4,b);e.moveTo(a/4,b);e.lineTo(0,b);e.lineTo(0,b-a/4);e.moveTo(0,a/4);e.lineTo(0,0);e.stroke()}};q(d,0,0,a,b);return d}
function ka(){var a={h:function(b){b.strokeStyle="#000";b.lineWidth=1.5;b.beginPath();b.arc(-12,-13,35,.2*Math.PI,.4*Math.PI,!1);b.stroke();b.beginPath();b.arc(20,-5,22,.55*Math.PI,.85*Math.PI,!1);b.stroke();b.beginPath();b.arc(17,-3,22,.55*Math.PI,.85*Math.PI,!1);b.stroke()}};q(a,0,0);return a}
function ja(){var a={fillStyle:"#555",h:function(b){var d=b.createRadialGradient(2,-3,27,10,-20,0);d.addColorStop(0,"#222");d.addColorStop(.1,this.fillStyle);b.strokeStyle="#000";b.fillStyle=d;b.lineWidth=2;b.beginPath();b.arc(0,0,25,0,2*Z,!1);b.stroke();b.fill()}};q(a);return a}function Ba(a,b){var d={h:function(e){e.strokeStyle="#F00";e.fillStyle="#FF0";e.lineWidth=4;e.beginPath();e.arc(-1,-1,2,0,2*Z,!1);e.stroke();e.fill()}};q(d,a,b,4,4);return d}
function ob(){var a={h:function(b){b.strokeStyle="#F00";b.fillStyle="#FF0";b.lineWidth=2;b.beginPath();b.lineTo(0,1);b.lineTo(50,0);b.lineTo(0,-1);b.stroke();b.fill()}};q(a,0,0);a.visible=!1;return a}function Oa(){var a=!0;a=void 0===a?!0:a;var b={h:function(d){d.lineWidth=8;d.beginPath();a?(d.strokeStyle="#F00",d.arc(20,22,35,0,2*Z,!1)):(d.strokeStyle="#0F0",d.moveTo(-10,-10),d.lineTo(10,10),d.moveTo(10,-10),d.lineTo(-10,10));d.stroke()}};q(b,0,0,10,10);return b}
function mb(){var a={h:function(b){var d=b.createLinearGradient(0,0,-100,500);d.addColorStop(0,"#444");d.addColorStop(.2,"#333");d.addColorStop(1,"#222");b.beginPath();b.rect(-1200,-500,2400,1E3);b.fillStyle=d;b.fill()}};q(a,0,0,2400,1E3);return a}
function hb(a,b){var d={h:function(e){e.lineWidth=3;e.beginPath();var f=e.createLinearGradient(30,-100,-100,100),c=e.createLinearGradient(50,-30,0,40);f.addColorStop(0,"#999");f.addColorStop(.5,"#444");f.addColorStop(1,"#000");c.addColorStop(0,"#777");c.addColorStop(1,"#000");e.arc(0,7,60,0,2*Z,!1);e.clip();e.fillStyle=c;e.fillRect(-35,-50,70,50);e.fillStyle=f;e.fillRect(-50,0,100,50);e.fillStyle="#00F";e.fillRect(-20,20,40,30)}};q(d,a,b,100,100);return d}
function jb(a,b,d){var e=[0,0,a,a/2,0,0,2*Z,!0],f=[-.15*a,.45*a,a,a/1.2,0,0,2*Z,!1],c={h:function(l){l.strokeStyle="#333";l.beginPath();l.ellipse.apply(l,ba(e));l.fillStyle="#222";l.fill();l.stroke()}},g=new Path2D;g.ellipse.apply(g,ba(e));var k={h:function(l){l.lineWidth=3;l.strokeStyle="#333";l.beginPath();l.ellipse.apply(l,ba(e));l.stroke();l.clip(g);l.ellipse.apply(l,ba(f));l.fillStyle="#555";l.fill()}};q(k,b,d,a,a);q(c,b,d,a,a);L.g(c);L.g(k);c.rotation=Z;k.rotation=Z;c={};q(c,Math.floor(b-a/
1.8),Math.floor(d-.1*a),Math.floor(2.2*a),Math.floor(1.2*a));P.g(c);Ia.push(c)}function ib(a,b){var d=I(10,170,0),e=I(1,4),f=I(0,5,0);e=void 0===e?2:e;f=void 0===f?0:f;var c={h:function(g){g.lineWidth=e;g.strokeStyle="#000";g.lineJoin="round";g.lineCap="round";g.beginPath();g.ellipse(0,0,d/2,f,0,Z,2*Z,!1);g.stroke()}};c.alpha=1-e/3;q(c,a,b,d,10);L.g(c);c.rotation=I(-.15,.15,0)}
function pb(){var a={length:10,h:function(b){b.strokeStyle="#F00";b.lineWidth=2;b.beginPath();b.moveTo(0,0);b.lineTo(this.length,0);b.stroke()},vb:function(b){this.length=b-40}};q(a,0,0,100,100);a.visible=!1;return a}
function Da(a,b){b=void 0===b?!0:b;var d=void 0===d?-50:d;var e=void 0===e?-35:e;var f=void 0===f?70:f;var c=void 0===c?5:c;var g={h:function(l){l.lineWidth=2;l.beginPath();l.moveTo(d,e);l.fillStyle="#000";l.fillRect(-f/2,-c/2,f,c);l.fillStyle="#222";l.fillRect(.1*-f,c/2,-f/10,17);l.stroke();l.fill()}};q(g,d,e,150,150);var k={h:function(l){l.lineWidth=2;l.beginPath();l.moveTo(d,e);l.fillStyle="#433";l.rect(-2,-5,4,10);l.stroke();l.fill()},lb:function(){k.Ta.l=!0;u.wait(50,function(){return k.Ta.l=
!1})}};q(k,d,e,150,150);k.l=!0;k.g(g);g.y=-8;g.x=23;a.j.g(k);a.J=k;a.J.rotation=a.aa;b?(a=ob(),k.g(a),k.Ta=a,a.x=108,a.y=42):(b=pb(),k.g(b),b.x=82.5,b.y=17,a.Ha=b)}
function lb(){var a={h:function(d){d.beginPath();d.arc(0,0,150,0,2*Z,!1);d.fillStyle="#00F";d.fill()}},b={h:function(d){d.beginPath();d.fillStyle="#080";d.moveTo(-2,-35);d.lineTo(75,-28);d.lineTo(75,15);d.lineTo(24,65);d.moveTo(25,100);d.lineTo(35,70);d.lineTo(80,100);d.lineTo(50,180);d.lineTo(38,120);d.moveTo(220,120);d.lineTo(190,60);d.lineTo(150,45);d.lineTo(170,0);d.lineTo(240,0);d.lineTo(260,40);d.fill()}};q(b,260,-200,150,150);q(a,260,-200,150,150);a.g(b);b.x=-120;b.y=-50;return a}
function Fa(){var a={h:function(b){b.strokeStyle="#000";b.fillStyle="#0F0";b.lineWidth=2;b.beginPath();b.ellipse(0,-14,10,12,0,0,2*Z,!1);b.stroke();b.fill()}};q(a,0,0);return a};var Y,db,eb;