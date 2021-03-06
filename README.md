smesh
=====

manage a mesh of etcd hosts

![Smesh](https://github.com/binocarlos/smesh/raw/master/exchange.jpg)

## install

First - ensure your hostname is set correctly.

Then [install docker](https://github.com/binocarlos/docker-install).

```bash
$ wget -qO- https://raw.github.com/binocarlos/docker-install/master/bootstrap.sh | sudo bash
```

if you are using vagrant - run this command to allow the vagrant user access to the docker socket:

```bash
$ sudo usermod -aG docker vagrant
```

You will then need to restart your command line session.

Then pull the required images:

```bash
$ docker pull binocarlos/smesh
$ docker pull coreos/etcd
```

## usage

To make a smesh cluster you first need an etcd token:

```bash
node1:~$ export SMESH_TOKEN=$(docker run --rm binocarlos/smesh token)
```

Then set the SMESH_IP variable to the IP address of an interface accesible by other members of the cluster:

```bash
node1:~$ export SMESH_IP=192.168.8.120
```

Then we can use these values to boot an etcd server

```bash
node1:~$ $(docker run --rm binocarlos/smesh start --token $SMESH_TOKEN --hostname $HOSTNAME --address $SMESH_IP)
```

And then on the other servers:

```bash
node2:~$ SMESH_TOKEN=https://discovery.etcd.io/f349523a1502f4e53fabd2b9df22bd72
node2:~$ SMESH_IP=192.168.8.121
node2:~$ $(docker run --rm binocarlos/smesh start --token $SMESH_TOKEN --hostname $HOSTNAME --address $SMESH_IP)
```

Now there is a cluster of 3 etcd servers running - you can run etcdctl on one of the servers:

```bash
node1:-$ docker run --rm binocarlos/etcdctl --peers 192.168.8.120:4001 set /apples hello
node1:-$ docker run --rm binocarlos/etcdctl --peers 192.168.8.120:4001 ls / --recursive
```

to stop the smesh container:

```bash
node1:~$ docker stop smesh && docker rm smesh
```

## manual peers

You can use the --peers option rather than --token if you want to manually co-ordinate the cluster:

```bash
node1:~$ $(docker run --rm binocarlos/smesh start --hostname $HOSTNAME --address 192.168.8.120 --peers boot)
```

```bash
node2:~$ $(docker run --rm binocarlos/smesh start --hostname $HOSTNAME --address 192.168.8.121 --peers 192.168.8.120:7001,192.168.8.122:7001)
```

```bash
node3:~$ $(docker run --rm binocarlos/smesh start --hostname $HOSTNAME --address 192.168.8.122 --peers 192.168.8.120:7001,192.168.8.121:7001)
```

## license

MIT