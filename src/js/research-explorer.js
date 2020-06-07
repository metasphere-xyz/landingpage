/**
 * Entry point of the JavaScript for the landingpage.
 *
 * @module landingpage
 */

import Vue from 'vue'

import SectionNavigatorMixin from '@components/section-navigator-mixin'

new Vue({
  el: '#section-navigator',
  mixins: [
    SectionNavigatorMixin
  ]
})
