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

Start etcd on the first server and pass the --bootstrap flag to get a cluster token:

```bash
node1:~$ $(docker run --rm -i -t binocarlos/smesh start --bootstrap --address 192.168.8.120)
```

## license

MIT