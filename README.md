smesh
=====

a mesh of docker hosts using consul

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

## usage

Initiate the cluster on eth1 (the private network) of the first machine:

```bash
node-0:~$ smesh bootstrap eth1
```

Then - join the other nodes to the first nodes IP:

```bash
node1:~$ smesh server eth1 192.168.8.120
node2:~$ smesh server eth1 192.168.8.120
```

Then - shutdown consul on the bootstrap server and start the server normally:

```bash
node-0:~$ smesh reboot eth1 192.168.8.121
```

The smesh cluster is now running - you can join subsequent servers as clients:

```bash
node-8:~$ smesh client eth1 192.168.8.120
```

## api

#### `smesh cmd:bootstrap <interface> [args]`

This is used on the first server to initiate a cluster.

Pass the name of the interface - this is usually the private network of the host.

Extra arguments are passed to consul intact

#### `smesh cmd:server <interface> <join-ip> [args]`

This is used to bootstrap subsequent servers - pass the interface name and the IP of the initial server

Extra arguments are passed to consul intact

#### `smesh cmd:reboot <interface> <join-ip> [args]`

Used on the first server once the subsequent ones have been setup - consul 0.4 will make this automatic.

Extra arguments are passed to consul intact

#### `smesh cmd:client <interface> <join-ip>`

This can be used on other servers in the data center that will be part of the smesh network but will not do the heavy lifting.

Extra arguments are passed to consul intact

## notes

smesh will create a data folder `/var/lib/smesh/consul` which is a persistent folder that contains consul data

## license

MIT