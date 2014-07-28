var hyperquest = require('hyperquest')
var concat = require('concat-stream')
var args = require('minimist')(process.argv, {
	alias:{
		bind:'b',
		address:'a',
		hostname:'h',
		image:'i',
		token:'t',
		volume:'v',
    port:'p',
    peerport:'pp'
	},
	default:{
		bind:'0.0.0.0',
    port:4001,
    peerport:7001,
		name:'smesh',
		image:'binocarlos/etcd',
		heartbeat:100,
		election:700,
		snapshot:100,
		volume:'/data/etcd'
	}
})


function checkArg(name){
  if(!args[name]){
    console.error('[error] please provide a ' + name + ' argument')
    process.exit(1)
  }    
}


function getToken(done){
  var req = hyperquest('https://discovery.etcd.io/new').pipe(concat(function(token){
    done(null, token.toString())
  }))

  req.on('error', done)
}

function dockerOpts(){
  var docker = [
    'run',
    '-d',
    '-t',
    '--name',
    args.name,
    '-v',
    args.volume,
    '-p',
    args.port + ':4001',
    '-p',
    args.peerport + ':7001',
    args.image
  ]

  return docker
}

function etcdOpts(){

	var volume = (args.volume || '').split(':')[1]

	if(!volume){
		volume = args.volume
	}

  var etcd = [
    '-name',
    args.hostname,
    '-bind-addr',
    args.bind + ':' + args.port,
    '-addr',
    args.address + ':' + args.port,
    '-peer-heartbeat-interval',
    args.heartbeat,
    '-peer-election-timeout',
    args.election,
    '-peer-bind-addr',
    args.bind + ':' + args.peerport,
    '-peer-addr',
    args.address + ':' + args.peerport,
    '-data-dir',
    volume,
    '-snapshot-count',
    args.snapshot,
    '-discovery',
    args.token
  ]

  return etcd
}

function commandToken(){
	getToken(function(err, token){
    if(err){
      console.error(err)
      process.exit(1)
    }
    console.log(token)
  })
}

function commandStart(){
  checkArg('address')
  checkArg('token')
  checkArg('hostname')
  var command = ['eval', 'docker'].concat(dockerOpts(), etcdOpts())
  console.log(command.join(' '))
}

var commands = {
	token:commandToken,
	start:commandStart
}

var command = args._[2] || 'start'

commands[command]()