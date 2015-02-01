import Ember from 'ember';

export default Ember.Route.extend({
	redirect: function() {
		if (this.get('session.organization')) {
			this.transitionTo('dashboard');
		}
	},
	actions: {
		willTransition: function(transition) {
			this.routeFor('application').send('openModal', 'activate', false);
			transition.abort();
		}
	}
});