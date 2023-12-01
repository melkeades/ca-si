import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import '@splidejs/splide/css'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'
import { Intersection } from '@splidejs/splide-extension-intersection'

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
const mq = gsap.matchMedia()
const mqd = 1440
const mqt = 991
const mql = 767
const mqm = 478

const sel = (e) => document.querySelector(e)
const selAll = (e) => document.querySelectorAll(e)
const vh = (percent) => window.innerHeight * (percent / 100)
const vw = (percent) => window.innerWidth * (percent / 100)

const lenis = new Lenis()
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

switch (sel('.page-wrapper').getAttribute('data-page')) {
  case 'home':
    home()
    break
  case 'contact':
    contact()
    break
  case 'legal':
    legal()
    break
  case 'error':
    error()
    break
  default:
    console.log('unknown data-page')
}
mq.add('(min-width: 991px)', () => {
  const navbarTl = gsap.to('.navbar-sticky', {
    keyframes: { '0%': { opacity: 0 }, '30%': { opacity: 1 }, '100%': { opacity: 1 } },
    yPercent: 100,
    ease: 'linear',
    paused: true,
  })
  ScrollTrigger.create({
    trigger: 'body',
    start: vh(100) + ' top',
    onToggle({ direction, getVelocity }) {
      // to reverse the easing
      gsap.to(navbarTl, { duration: 1.5, progress: direction === 1 ? 1 : 0, ease: 'expo.out' })
    },
  })
})
mq.add('(max-width: 767px)', () => {
  ScrollTrigger.create({
    animation: gsap.to('.navbar-sticky', { y: 0, opacity: 1 }, 0),
    trigger: 'body',
    start: vh(200) + ' top',
    toggleActions: 'play none none reverse',
  })
})
devMode(0)
function home() {}
function legal() {}

function contact() {}
function logosSliderInit() {
  const logosSlider = new Splide('.logos__slider', {
    arrows: false,
    pagination: false,
    gap: '4rem',
    type: 'loop',
    autoWidth: true,
    autoScroll: { speed: 0.6, autoStart: false },
    breakpoints: {
      767: {
        gap: '2rem',
      },
    },
  })
  // if not enough logos it will center them and stop the slider
  const Components = logosSlider.Components
  // to remove duplicates for inactive/small slider
  logosSlider.on('overflow', function (isOverflow) {
    logosSlider.go(0) // Reset the carousel position

    logosSlider.options = {
      focus: isOverflow ? 'center' : '',
      drag: isOverflow ? 'free' : false,
      clones: isOverflow ? undefined : 0, // Toggle clones
    }
  })
  let sliderOverflow = true
  let sliderReady = false
  // to center inactive/small slider
  logosSlider.on('resized', function () {
    var isOverflow = Components.Layout.isOverflow()
    sliderOverflow = isOverflow
    var list = Components.Elements.list
    var lastSlide = Components.Slides.getAt(logosSlider.length - 1)

    if (lastSlide) {
      // Toggles `justify-content: center`
      list.style.justifyContent = isOverflow ? '' : 'center'

      // Remove the last margin
      if (!isOverflow) {
        lastSlide.slide.style.marginRight = ''
      }
    }
    if (sliderReady) {
      s2PlayInit()
    }
  })
  logosSlider.on('mounted', s2PlayInit)
  function s2PlayInit() {
    sliderReady = true
    if (!sliderOverflow) {
      logosSlider.Components.AutoScroll.pause()
    } else if (sliderOverflow && logosSlider.Components.AutoScroll.isPaused()) {
      logosSlider.Components.AutoScroll.play()
    }
  }
  logosSlider.mount({ AutoScroll })
  return logosSlider
}
function testSliderInit() {
  const name = 'testimonials'
  const testSlider$ = sel(`.${name}__slider`)
  const testSlider = new Splide(testSlider$, {
    arrows: false,
    pagination: false,
    gap: '2rem',
    type: 'loop',
    perPage: 1,
    speed: 1500,
    interval: 5000,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    autoplay: 'pause',
    intersection: {
      inView: {
        autoplay: true,
      },
      outView: {
        autoplay: false,
      },
    },
    breakpoints: {
      747: {
        autoplay: false,
      },
    },
  })
  const testImgSlider$ = sel(`.${name}__img-slider`)
  const testImgSlider = new Splide(testImgSlider$, {
    type: 'fade',
    rewind: true, // to make it "loop" with the type fade
    arrows: false,
    pagination: false,
    perPage: 1,
    speed: 1000,
  })
  testImgSlider.sync(testSlider)
  testSlider.mount({ Intersection })
  testImgSlider.mount()
  // add arrows
  sel(`.${name}__arrows-wrap .arrow--left`).addEventListener('click', (e) => {
    testSlider.go('-1')
  })
  sel(`.${name}__arrows-wrap .arrow:not(.arrow--left)`).addEventListener('click', (e) => {
    testSlider.go('+1')
  })
  // parse bullets inside the container and repopulate
  const pagination$ = sel(`.${name}__pagination`)
  let bulletPressed = false
  if (testSlider.length > 1) {
    const bullet$ = sel(`.${name}__pagination .bullet:not(.bullet--active)`)
    let fragment = document.createDocumentFragment()
    for (let i = 0; i < testSlider.length; i++) {
      let clone$ = bullet$.cloneNode(true)
      clone$.addEventListener('click', (e) => {
        bulletPressed = true
        testImgSlider.go(i)
      })
      fragment.appendChild(clone$)
    }
    fragment.firstChild.classList.add('bullet--active')
    pagination$.replaceChildren(fragment)
  } else {
    pagination$.replaceChildren()
  }
  //  if swiping get the slide index and pause the slider
  let swiped = false
  let sliderIndexOld = 0
  ;[testSlider$, testImgSlider$].forEach((slider) => {
    slider.addEventListener('pointerdown', function (e) {
      sliderIndexOld = testSlider.index
      testSlider.Components.Autoplay.pause()
    })
    slider.addEventListener('pointerup', function (e) {
      swiped = true
      testSlider.Components.Autoplay.play()
    })
  })

  // animate parts of the slides
  let slideMetaTl
  const length = testSlider.length - 1
  // fires on a possible index update NOT 'move'
  testSlider.on('move', function (newIndex, oldIndex) {
    // abort if the new index = index on swipe end ('oldIndex' != 'newIndex' always)
    if (swiped && newIndex === sliderIndexOld) {
      swiped = false
      return
    }
    // update bullets
    sel(`.${name}__pagination .bullet--active`).classList.remove('bullet--active')
    sel(`.${name}__pagination .bullet:nth-of-type(${testSlider.index + 1})`).classList.add('bullet--active')
    // assess the direction of the movement
    let toRight = false
    if (bulletPressed) {
      toRight = newIndex > oldIndex
      bulletPressed = false
    } else {
      toRight = (newIndex > oldIndex && !(oldIndex === 0 && newIndex === length)) || (newIndex === 0 && oldIndex === length)
    }
    const newActiveSlide$ = testSlider.Components.Elements.slides[newIndex]
    const oldActiveSlide$ = testSlider.Components.Elements.slides[oldIndex]

    const newActiveMeta$a = newActiveSlide$.querySelectorAll('.testimonials__meta>div')
    const direction = toRight ? 1 : -1
    gsap.fromTo(newActiveSlide$, { opacity: 0 }, { opacity: 1, duration: 1 })
    if (slideMetaTl?.isActive) slideMetaTl.kill()
    slideMetaTl = gsap.fromTo(
      [...newActiveMeta$a],
      { opacity: 0, x: 50 * direction },
      { opacity: 1, x: 0, duration: 4, stagger: { amount: 0.3 }, ease: 'expo.out' }
    )
    gsap.fromTo(oldActiveSlide$, { opacity: 1 }, { opacity: 0, duration: 1 })
  })
}
function removeSplideClasses(slider) {
  const splide = document.querySelector('.' + slider)
  const track = splide.querySelector('.splide__track')
  const list = splide.querySelector('.splide__list')
  const slide = splide.querySelectorAll('.splide__slide')
  splide.classList.remove('splide')
  track.classList.remove('splide__track')
  list.classList.remove('splide__list')
  slide.forEach((slide) => slide.classList.remove('splide__slide'))
}
function addSplideClasses(slider) {
  const splide = document.querySelector('.' + slider)
  const track = splide.children[0]
  const list = track.children[0]
  const slide = list.childNodes
  splide.classList.add('splide')
  track.classList.add('splide__track')
  list.classList.add('splide__list')
  slide.forEach((slide) => slide.classList.add('splide__slide'))
}

function devMode(mode) {
  if (mode === 0) {
    return
  } else if (mode === 1) {
    let i = 0
    document.querySelectorAll('[data-video-urls]').forEach((el) => {
      el.querySelector('video').remove()
      i++
    })
    console.log('devMode, removed videos:', i)
  } else if (mode === 2) {
    const devRemoveList = []
    // const devRemoveList = [videoHero$, introSec$, aboutSec$]
    devRemoveList.forEach((el) => {
      el.remove()
    })
    // sel('.page-wrapper').style.paddingTop = '80vh'
    console.log('devMode: removing sections')
  }
}

const shiftUpElements = document.querySelectorAll('.up-50, [up-50]')
function shiftElementsInit() {
  shiftUpElements.forEach((e) => {
    const elementHeight = e.getBoundingClientRect().height
    e.style.marginBottom = -elementHeight / 2 + 'px'
  })
}
shiftElementsInit()
function debounce(func, time = 100) {
  let timer
  return function (event) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(func, time, event)
  }
}
window.addEventListener(
  'resize',
  debounce(() => {
    shiftElementsInit()
  })
)

function scrollTriggerInit(distance = 0, elClassName = '', sectionClassName = '') {
  sectionClassName = sectionClassName || elClassName
  return ScrollTrigger.create({
    animation: gsap.fromTo('.' + elClassName, { y: -distance }, { y: distance, ease: 'none' }),
    trigger: '.' + sectionClassName,
    start: 'top bottom',
    end: 'bottom top',
    // markers: true,
    scrub: true,
    delay: 0.0,
  })
}
