.PHONY: install

install: packages setup

packages: basics docker
setup: network

basics:
	apt-get update
	apt-get install -y git curl

docker: aufs
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