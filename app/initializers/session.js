/* globals Firebase */

import Ember from 'ember';

// var setElastic = function() {
// 	var client = new ElasticClient({ host: 'localhost', port: 9200 });
// 	function createOrUpdateIndex(snap) {
// 	   client.index(this.index, this.type, snap.val(), snap.key()).on('data', function(data) {
// 		 console.log('indexed ', snap.key()); }).on('error', function(err) { /* handle errors */ });
// 	}
// 	
// 	function removeIndex(snap) {
// 	   client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
// 	      if ( error ) { console.error('failed to delete', snap.key(), error); }
// 	      else {console.log('deleted', snap.key());}
// 	   });
// 	}
// 	
// 	window._RMDB.on('child_added',   createOrUpdateIndex);
// 	window._RMDB.on('child_changed', createOrUpdateIndex);
// 	window._RMDB.on('child_removed', removeIndex);
// };

export default {
  name: 'session',
	after: 'store',
  initialize: function(container, app) {
		window._RMDB = new Firebase('https://remetric.firebaseio.com/');
		window._RMOID = Ember.$('[data-remetric]').data('remetric').replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '');
		
		var store = container.lookup('store:main');
		var session = Ember.Object.create({
			organization_id: window._RMOID,
			isStripeLoaded: false
		});
		
		app.register('session:main', session, { instantiate: false, singleton: true });
		app.inject('route', 'session', 'session:main');
		app.inject('controller', 'session', 'session:main');
		app.inject('component', 'session', 'session:main');
		app.inject('view', 'session', 'session:main');
		app.inject('model', 'session', 'session:main');
		
		// setElastic();
		
		store.find('organization', window._RMOID).then(function(organization) {
			session.set('organization', organization);
			app.advanceReadiness();
		}, function() {
			app.advanceReadiness();
		});
		
		app.deferReadiness();
	}
};
