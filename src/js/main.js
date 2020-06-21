/**
 * Entry point of the JavaScript for the main page.
 *
 * @module main
 */

import Vue from 'vue'

import ProjectListMixin from '@components/project-list-mixin'

new Vue({
  el: '#project-list',
  mixins: [
    ProjectListMixin
  ]
})
