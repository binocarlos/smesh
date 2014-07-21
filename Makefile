VPC_URL ?= https://raw.github.com/binocarlos/vpc/master/bootstrap.sh

.PHONY: install basics docker aufs network vagrant vpc dockerimages fs

install: basics docker fs dockeropts dockerimages

fs:
	mkdir -p /var/lib/smesh/consul
	cp -f smesh /usr/local/bin/smesh
	chmod a+x /usr/local/bin/smesh

basics:
	apt-get update
	apt-get install -y git curl

dockerimages:
	./smesh dockerimages

docker: aufs network
	egrep -i "^docker" /etc/group || groupadd docker
	curl https://get.docker.io/gpg | apt-key add -
	echo deb http://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list
	apt-get update
	apt-get install -y lxc-docker
	sleep 2

aufs:
	lsmod | grep aufs || modprobe aufs || apt-get install -y linux-image-extra-`uname -r`

network:
	sysctl -w net.ipv4.ip_forward=1

vpc: network
	wget -qO- ${VPC_URL} | sudo bash
	sleep 1
	service docker restart
	sleep 1

vagrant:
	usermod -aG docker vagrant