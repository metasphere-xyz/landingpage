import debounce from 'lodash.debounce'

/**
 * Vue mixin of a section navigator.
 *
 * @namespace SectionNavigatorMixin
 *
 * @memberof module:landingpage/components
 */
export const SectionNavigatorMixin = {
  props: {
    sectionCaptureMargin: {
      type: Number,
      default: 20
    }
  },
  data: {
    sectionIds: [],
    sectionStates: {},
    isFolded: false,
    isVisible: false,
    // function to be delayed.
    // initialized just before mounted.
    debounce: {
      hideMenu: () => {}
    }
  },
  computed: {
    firstSectionId () {
      return (this.sectionIds.length > 0) ? this.sectionIds[0] : undefined
    },
    firstSection () {
      return this.firstSectionId ? this.section(this.firstSectionId) : null
    },
    firstSectionState () {
      if (this.firstSectionId) {
        return this.sectionStates[this.firstSectionId]
      } else {
        return {
          isActive: false
        }
      }
    }
  },
  beforeCreate() {
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
    if (process.env.NODE_ENV !== 'production') {
      console.log('beforeMount')
    }
    this.debounce.hideMenu = debounce(() => this.hideMenu(), 200)
  },
  mounted () {
    if (process.env.NODE_ENV !== 'production') {
      console.log('mounted', this.sectionIds)
    }
    // activates the first section
    // how do you justify this?
    // - if the other section of the page is shown,
    //   it is handled by a `scroll` event later.
    this.firstSectionState.isActive = true
    // monitors pointer events on the container
    this.$el.addEventListener('pointerover', event => {
      this.onPointerover(event)
    })
    this.$el.addEventListener('pointerout', event => {
      this.onPointerout(event)
    })
    // monitors scroll
    window.addEventListener('scroll', event => {
      this.onScroll(event)
    })
  },
  methods: {
    section (sectionId) {
      return document.getElementById(sectionId)
    },
    menuClass () {
      return {
        'is-hidden': this.isFolded && !this.isVisible,
        'is-fixed': this.isFolded
      }
    },
    // this function automatically collects link elements
    // that need dynamic state management.
    menuItemClass (sectionId) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('menuItemClass', sectionId, this.sectionStates[sectionId])
      }
      if (!(sectionId in this.sectionStates)) {
        this.sectionIds.push(sectionId)
        // to make sectionStates reactive,
        // you cannot simply add a new property.
        // replace the entire object instead.
        this.sectionStates = {
          ...this.sectionStates,
          [sectionId]: {
            isActive: false
          }
        }
      }
      return {
        'is-active': this.sectionStates[sectionId].isActive
      }
    },
    hideMenu () {
      this.isVisible = false
    },
    onPointerover (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('pointerover', event, this.isVisible)
      }
      this.debounce.hideMenu.cancel()
      this.isVisible = true
    },
    onPointerout (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('pointerout', event, this.isVisible)
      }
      this.debounce.hideMenu()
    },
    onScroll (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('scroll', event)
      }
      // determines if the menu is folded.
      if (this.firstSection) {
        const { bottom } = this.firstSection.getBoundingClientRect()
        if (process.env.NODE_ENV !== 'production') {
          console.log(`checking scroll: ${window.scrollY} > ${bottom}`)
        }
        if (bottom < 0) {
          this.isFolded = true
        } else {
          this.isFolded = false
        }
      }
      // identifies the current section.
      // the first section is activated if no other sections are active.
      let isFirstSectionActive = true
      for (let i = 1; i < this.sectionIds.length; ++i) {
        let isActive = false
        const sectionId = this.sectionIds[i]
        const section = this.section(sectionId)
        if (section) {
          const { top } = section.getBoundingClientRect()
          if (top <= this.sectionCaptureMargin) {
            if ((i + 1) < this.sectionIds.length) {
              const nextSection = this.section(this.sectionIds[i + 1])
              if (nextSection) {
                const { top: nextTop } = nextSection.getBoundingClientRect()
                if (nextTop > this.sectionCaptureMargin) {
                  isActive = true
                }
              } else {
                isActive = true
              }
            } else {
              isActive = true
            }
          }
        }
        if (this.sectionStates[sectionId].isActive !== isActive) {
          this.sectionStates[sectionId].isActive = isActive
        }
        if (isActive) {
          isFirstSectionActive = false
        }
      }
      if (this.firstSectionState.isActive !== isFirstSectionActive) {
        this.firstSectionState.isActive = isFirstSectionActive
      }
    }
  }
}

export default SectionNavigatorMixin
