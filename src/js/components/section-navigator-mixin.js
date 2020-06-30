import debounce from 'lodash.debounce'

/**
 * Vue mixin of a section navigator.
 *
 * #### Dynamic styling
 *
 * The following functions implement dynamic styling of the section navigator.
 *
 * The `navigatorClass` method returns a combination of the following CSS
 * classes,
 * - `is-folded`: if the navigation menu is folded.
 * - `is-slid-in`: if the navigation menu is folded but temporarily visible
 *   because a pointer is on it.
 *
 * The `menuItemClass(sectionId)` method returns the following CSS class,
 * - `is-active`: if the current section is the section identified by
 *   `sectionId`.
 *
 * @namespace SectionNavigatorMixin
 *
 * @memberof module:landingpage/components
 *
 * @vue-prop {String} [menu-class-name="navigation-menu"]
 *
 *   Class name assigned to an element that works as a navigation menu.
 *   If there are multiple elements that have this class, only the first one
 *   is used.
 *
 * @vue-prop {Number} [section-capture-margin="section-capture-margin"]
 *
 *   A section is considered as passed if the top position of the section is
 *   less than this number.
 */
export const SectionNavigatorMixin = {
  props: {
    menuClassName: {
      type: String,
      default: 'navigation-menu'
    },
    sectionCaptureMargin: {
      type: Number,
      default: 30
    }
  },
  data: {
    sectionIds: [],
    sectionStates: {},
    isFolded: false,
    isVisible: false,
    // isImmune: the menu does not accept a click event for a short period
    // after a pointermove event. during this immune period a pointermove event
    // issued just after a user touch the menu to open is ignored.
    isImmune: false,
    // function to be delayed.
    // initialized just before mounted.
    debounce: {
      hideMenu: () => {},
      cancelImmunity: () => {}
    }
  },
  computed: {
    menuElement () {
      const elements = this.$el.getElementsByClassName(this.menuClassName)
      if (elements.length > 0) {
        if (elements.length > 1) {
          console.warn(`only one navigation menu is supported. but ${elements.length} elements match`)
        }
        return elements[0]
      } else {
        return null
      }
    },
    firstSectionId () {
      return (this.sectionIds.length > 0) ? this.sectionIds[0] : undefined
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
    this.debounce.cancelImmunity = debounce(() => this.cancelImmunity(), 50)
  },
  mounted () {
    if (process.env.NODE_ENV !== 'production') {
      console.log('mounted', this.sectionIds)
    }
    // activates the first section.
    // how do you justify this?
    // - if the other section of the page is shown,
    //   it is handled by a `scroll` event later.
    this.firstSectionState.isActive = true
    // monitors pointer events on the container
    this.menuElement.addEventListener('pointerover', event => {
      this.onPointerover(event)
    })
    this.menuElement.addEventListener('pointerout', event => {
      this.onPointerout(event)
    })
    // catches any clicks to hide the menu
    window.addEventListener('click', event => {
      if (!event.defaultPrevented) {
        this.isVisible = false
      }
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
    navigatorClass () {
      return {
        'is-folded': this.isFolded,
        'is-slid-in': this.isFolded && this.isVisible
      }
    },
    // this function automatically collects link elements
    // that need dynamic state management.
    // supposes that it is called in the order of sections.
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
    cancelImmunity () {
      this.isImmune = false
    },
    onClick (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('click', event, this.isVisible)
      }
      // nothing should be done if the menu is not folded
      if (!this.isFolded) {
        return
      }
      if (this.isVisible) {
        if (!this.isImmune) {
          this.isVisible = false
        } else {
          // prevents following a link and
          // the default handler attached to a window that closes the menu
          event.preventDefault()
        }
      } else {
        // prevents following a link and
        // the default handler attached to a window that closes the menu
        event.preventDefault()
        this.isVisible = true
      }
    },
    onPointerover (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('pointerover', event, this.isVisible)
      }
      this.debounce.hideMenu.cancel()
      if (!this.isVisible) {
        this.isVisible = true
        this.isImmune = true
        this.debounce.cancelImmunity()
      }
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
      // folds the menu if the top of the navigator is out of the window.
      const { top: navigatorTop } = this.$el.getBoundingClientRect()
      if (navigatorTop < 0) {
        this.isFolded = true
      } else {
        this.isFolded = false
      }
      // identifies the current section.
      // the first section is activated if no other sections are active.
      let isFirstSectionActive = true
      for (let i = 1; i < this.sectionIds.length; ++i) {
        let isActive = false
        // a section is active
        // if both of the following two conditions are satisfied,
        // 1. the section is passed
        // 2. the next section is not passed
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
