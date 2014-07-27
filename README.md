smesh
=====

manage a mesh of docker and etcd hosts

![Smesh](https://github.com/binocarlos/smesh/raw/master/exchange.jpg)

## install

First - ensure your hostname is set correctly.

Then install docker - you can use [docker-install](https://github.com/binocarlos/docker-install) for this.

```bash
$ wget -qO- https://raw.github.com/binocarlos/docker-install/master/bootstrap.sh | sudo bash
```

## usage

To make a smesh cluster you first need an etcd token:

```
node1:~$ token=$(docker run --rm binocarlos/smesh token)
node1:~$ echo $token
https://discovery.etcd.io/f349523a1502f4e53fabd2b9df22bd72
```

You can then use this token to boot the etcd servers:

```
node1:~$ $(docker run --rm binocarlos/smesh start --token $token --hostname $HOSTNAME --address 192.168.8.120)
```

And then on the other servers:

```
node2:~$ token=https://discovery.etcd.io/f349523a1502f4e53fabd2b9df22bd72
node2:~$ $(docker run --rm binocarlos/smesh start --token $token --hostname $HOSTNAME --address 192.168.8.121)
```

```
node3:~$ token=https://discovery.etcd.io/f349523a1502f4e53fabd2b9df22bd72
node3:~$ $(docker run --rm binocarlos/smesh start --token $token --hostname $HOSTNAME --address 192.168.8.122)
```

Now there is a cluster of 3 etcd servers running - you can run etcdctl on one of the servers:


```
node1:-$ docker run --rm binocarlos/etcdctl --peers 192.168.8.120:4001 ls / --recursive
```

## license

MIT