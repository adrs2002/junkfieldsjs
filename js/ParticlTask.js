importScripts('three.js', 'clsParticle.js');

self.addEventListener('message', function (e) {
    for (var i = 0; i < e.data[0].length; i++) {
        particleComp.ParticeUpdate(e.data[0][i], e.data[1]);
    }
    self.postMessage(e.data);
}, false);