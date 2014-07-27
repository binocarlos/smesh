var args = require('minimist')(process.argv, {
	alias:{
		bootstrap:'b',
		bind:'i',
		address:'a',
		name:'n',
		token:'t',
		heartbeat:'h',
		election:'e',
		snapshot:'s'
	},
	default:{
		bind:'0.0.0.0',
		name:'smesh',
		heartbeat:100,
		election:700,
		snapshot:100
	}
})

function dockerOpts(){

}

function etcdOpts(token){
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
    '/data/etcd',
    '-snapshot-count',
    args.snapshot,
    '-discovery',
    token
  ]
}

var image = 'binocarlos/etcd'

var command = args._[2] || 'start'

