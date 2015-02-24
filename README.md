ozp-demo
========

Set of applications, webtops, and other components for demoing the Ozone Platform.

Each application should be in it's own directory and largely stand alone.

## GitHub Pages
These applications are served at [http://ozone-development.github.io/ozp-demo](http://ozone-development.github.io/ozp-demo/index.html)

If you make changes you want to publish to the server, run ```grunt gh-pages```

IMPORTANT: As of Feb 2015, need to manually change the apiRootUrl in 
bower_components/ozp-iwc/dist/iframe_peer.html to point to owfgoss (or wherever
the backend is): ozpIwc.apiRootUrl="https://www.owfgoss.org/ng/dev/mp/api";