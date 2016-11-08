import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Route.extend({
  catalog: Ember.inject.service(),
  allServices: Ember.inject.service(),

  model() {
    return Ember.RSVP.hash({
      catalogInfo: this.get('catalog').fetchTemplates({templateBase: 'infra', category: 'all'}),
      serviceChoices: this.get('allServices').choices(),
    }).then((hash) => {
      let existing = this.modelFor('settings.projects').projectTemplates;

      let def = existing.find((tpl) => tpl.get('name').toLowerCase() === C.PROJECT_TEMPLATE.DEFAULT);
      if ( def ) {
        let tpl = def.cloneForNew();
        tpl.isPublic = false;
        tpl.name = '';
        tpl.description = '';
        hash.projectTemplate = tpl;
      } else {
        hash.projectTemplate = this.get('userStore').createRecord({
          type: 'projectTemplate',
          stacks: [],
          isPublic: false,
        });
      }

      hash.originalProjectTemplate = hash.projectTemplate;
      return hash;
    });
  }
});
