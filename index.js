console.log('-------------------------------------------');
console.dir(process.argv)
process.exit()

var args = require('minimist')(process.argv, {
	alias:{
		bind:'b',
		address:'a',
		hostname:'h',
		image:'i',
		token:'t',
		volume:'v'
	},
	default:{
		bind:'0.0.0.0',
		name:'smesh',
		image:'binocarlos/etcd',
		heartbeat:100,
		election:700,
		snapshot:100,
		volume:'/data/etcd'
	}
})

console.log('-------------------------------------------');
console.dir(args)
process.exit()

if(!args.address){
	console.error('[error] please provide an --address argument')
	process.exit(1)
}

if(!args.token){
	console.error('[error] please provide either --token or --bootstrap argument')
	process.exit(1)
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
    '4001:4001',
    '-p',
    '7001:7001',
    args.image
  ]

  return docker
}

function etcdOpts(token){

	var volume = (args.volume || '').split(':')[1]

	if(!volume){
		volume = args.volume
	}

  var etcd = [
    '-name',
    args.name,
    '-bind-addr',
    args.bind + ':4001',
    '-addr',
    args.address + ':4001',
    '-peer-heartbeat-interval',
    args.heartbeat,
    '-peer-election-timeout',
    args.election,
    '-peer-bind-addr',
    args.bind + ':7001',
    '-peer-addr',
    args.address + ':7001',
    '-data-dir',
    volume,
    '-snapshot-count',
    args.snapshot,
    '-discovery',
    token
  ]

  return etcd
}

function commandToken(){
	return 'token'
}

function commandStart(){
	return 'start'
}

function commandStop(){
	return 'stop'
}

var commands = {
	token:commandToken,
	start:commandStart,
	stop:commandStop
}

var command = args._[2] || 'start'

console.log(commands[command]())