FROM 		binocarlos/nodejs
MAINTAINER 	Kai Davenport <kaiyadavenport@gmail.com>

ADD . /srv/smesh
RUN cd /srv/smesh && npm install

ENTRYPOINT ["/usr/local/bin/node", "/srv/smesh"]