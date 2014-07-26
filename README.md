smesh
=====

a mesh of docker hosts using consul

![Smesh](https://github.com/binocarlos/smesh/raw/master/exchange.jpg)

## install

First - ensure your hostname is set correctly.

Then - install smesh:

```bash
$ wget -qO- https://raw.github.com/binocarlos/smesh/master/bootstrap.sh | sudo bash
```

Or - git clone manually and then:

```
$ sudo make install
```

If you have a private network, first tell smesh which interface it should operate on (eth0 is default):

```bash
smesh-0:~$ smesh interface eth1
```

Then we update the docker configuration to listen on that interface and bind to consul DNS:

```bash
smesh-0:~$ sudo smesh dockeropts
```

The above 2 steps must be repeated on each smesh server

## usage

Then initiate the cluster on the first machine:

```bash
smesh-0:~$ smesh bootstrap
```

Then - join the other nodes to the first nodes IP:

```bash
smesh-1:~$ smesh server 192.168.8.120
smesh-2:~$ smesh server 192.168.8.120
```

Then - shutdown consul on the bootstrap server and start in join mode:

```bash
smesh-0:~$ smesh stop
smesh-0:~$ smesh server 192.168.8.121
```

The smesh cluster is now running with 3 servers.

Extra servers can join as clients:

```bash
smesh-8:~$ smesh client eth1 192.168.8.120
```

Extra arguments are passed to consul intact - [list of cli options](http://www.consul.io/docs/agent/options.html)

## api

#### `smesh interface [name]`

Set/get the name of the interface that consul will listen on - this is normally the private network but will default to eth0.

```bash
$ sudo smesh interface eth1
```

#### `smesh bootstrap [args]`

This is used on the first server to initiate a cluster - args are passed to consul.

#### `smesh server <join-ip> [args]`

This is used to bootstrap subsequent servers - pass the interface name and the IP of the initial server

#### `smesh client <join-ip> [args]`

This can be used on other servers in the data center that will be part of the smesh network but will not do the heavy lifting.

#### `smesh consul [args]`

This proxies commands to the consul binary and sets the -rpc-addr automatically

```bash
$ smesh consul members
```

is expanded to:

```bash
$ smesh consul members -rpc-addr `smesh ip eth1`:8400
```

## notes

smesh will create a data folder `/var/lib/smesh/consul` which is a persistent folder that contains consul data

## license

MIT