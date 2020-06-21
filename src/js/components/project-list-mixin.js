/**
 * Vue mixin of a project list.
 *
 * @namespace ProjectListMixin
 *
 * @memberof module:landingpage/components
 *
 * @vue-prop {String} [project-heading-class-name="project-heading"]
 *
 *   Class name of a heading element of a project.
 *
 * @vue-prop {String} [project-details-class-name="project-details"]
 *
 *   Class name of a project details element.
 */
export const ProjectListMixin = {
  props: {
    projectHeadingClassName: {
      type: String,
      default: 'project-heading'
    },
    projectDetailsClassName: {
      type: String,
      default: 'project-details'
    }
  },
  data: {
    projectIds: [],
    projectStates: {}
  },
  beforeCreate () {
    // just for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('beforeCreate')
    }
  },
  created () {
    // just for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('created')
    }
  },
  beforeMount () {
    // just for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('beforeMount')
    }
  },
  mounted () {
    if (process.env.NODE_ENV !== 'production') {
      console.log('mounted')
    }
    // assigns actions to project headings
    for (let projectId of this.projectIds) {
      this.addActionToProjectHeading(projectId)
    }
  },
  methods: {
    projectStateClass (projectId) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('projectStateClass', projectId, this.projectStates[projectId])
      }
      if (!(projectId in this.projectStates)) {
        this.projectIds.push(projectId)
        // to make `projectStates` reactive,
        // you cannot simply add a new property to it.
        // replace the entire object instead.
        this.projectStates = {
          ...this.projectStates,
          [projectId]: {
            isFolded: true,
            hasDetails: this.findProjectDetails(projectId) !== null
          }
        }
      }
      return {
        'is-folded': this.projectStates[projectId].isFolded
      }
    },
    findProject (projectId) {
      return document.getElementById(projectId)
    },
    // finds the heading element of a project identified by `projectId`.
    // returns `null` if no project is associated with `projectId`,
    // or the project has no details.
    // returns the first element if the project has multiple heading elements.
    findProjectHeading (projectId) {
      const project = this.findProject(projectId)
      if (!project) {
        console.error('no such project', projectId)
        return null
      }
      const heading = project
        .getElementsByClassName(this.projectHeadingClassName)
      if (heading.length > 0) {
        return heading[0]
      } else {
        return null
      }
    },
    // finds the details element of a project identified by `projectId`.
    // returns `null` if no project is associated with `projectId`,
    // or the project has no details.
    // returns the first element if the project has multiple details elements.
    findProjectDetails (projectId) {
      const project = this.findProject(projectId)
      if (!project) {
        console.error('no such project', projectId)
        return null
      }
      const details =
        project.getElementsByClassName(this.projectDetailsClassName)
      if (details.length > 0) {
        return details[0]
      } else {
        return null
      }
    },
    addActionToProjectHeading (projectId) {
      const heading = this.findProjectHeading(projectId)
      if (heading) {
        // toggles folded/unfolded when it is clicked
        heading.addEventListener('click', () => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('click', projectId)
          }
          const projectState = this.projectStates[projectId]
          if (projectState.hasDetails) {
            projectState.isFolded = !projectState.isFolded
            // explicitly gives the height of details
            // to enable transition.
            const details = this.findProjectDetails(projectId)
            if (details) {
              if (projectState.isFolded) {
                details.style.height = 0
              } else {
                details.style.height = `${details.scrollHeight}px`
              }
            }
          }
        })
      }
    }
  }
}

export default ProjectListMixin
