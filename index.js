var hyperquest = require('hyperquest')
var concat = require('concat-stream')
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


function checkAddress(){
  if(!args.address){
    console.error('[error] please provide an --address argument')
    process.exit(1)
  }    
}

function checkToken(){
  if(!args.token){
  	console.error('[error] please provide a --token argument - run the token command to generate one')
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
	getToken(function(err, token){
    if(err){
      console.error(err)
      process.exit(1)
    }
    console.log(token)
  })
}

function commandStart(){
  checkAddress()
  checkToken()
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

commands[command]()