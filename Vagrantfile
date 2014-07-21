# -*- mode: ruby -*-
# vi: set ft=ruby :

BOX_NAME = ENV['BOX_NAME'] || "precise64docker"
BOX_URI = ENV['BOX_URI'] || "https://oss-binaries.phusionpassenger.com/vagrant/boxes/ubuntu-12.04.3-amd64-vbox.box"

Vagrant::Config.run do |config|
  config.vm.box = BOX_NAME
  config.vm.box_url = BOX_URI
  config.ssh.forward_agent = true
end

Vagrant::VERSION >= "1.1.0" and Vagrant.configure("2") do |config|

  (0..2).each do |i|
    config.vm.define "smesh-#{i}" do |slave|
      slave.vm.network :private_network, ip: "192.168.8.12#{i}"

      if i == 0
        slave.vm.network :forwarded_port, guest: 443, host: 443
        slave.vm.network :forwarded_port, guest: 80, host: 8080
      end

      $provision_script = <<PROVISION_SCRIPT
echo "installing smesh"
hostname smesh-#{i}
echo "smesh-#{i}" > /etc/hostname
echo "192.168.8.120   smesh-0" >> /etc/hosts
echo "192.168.8.121   smesh-1" >> /etc/hosts
echo "192.168.8.122   smesh-2" >> /etc/hosts
PROVISION_SCRIPT

      slave.vm.provision "shell", inline: <<SCRIPT
echo "installing smesh"
hostname smesh-#{i}
echo "smesh-#{i}" > /etc/hostname
echo "192.168.8.120   smesh-0" >> /etc/hosts
echo "192.168.8.121   smesh-1" >> /etc/hosts
echo "192.168.8.122   smesh-2" >> /etc/hosts
cd /vagrant && make install
SCRIPT

    end
  end
end