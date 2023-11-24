import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Splide from '@splidejs/splide'
import '@splidejs/splide/css'
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll'

gsap.registerPlugin(ScrollTrigger)
const mq = gsap.matchMedia()
const mqd = 1440
const mqt = 991
const mql = 767
const mqm = 478

const sel = (e) => document.querySelector(e)
const selAll = (e) => document.querySelectorAll(e)
const vh = (e) => window.innerHeight * (e / 100)
const vw = (e) => window.innerWidth * (e / 100)

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
  case 'terms':
    terms()
    break
  case 'error':
    error()
    break
  default:
    console.log('unknown data-page')
}
ScrollTrigger.create({
  animation: gsap.timeline().to('.navbar-sticky-wrap', { y: 0, opacity: 1 }, 0),
  trigger: 'body',
  start: vh(100) + ' top',
  toggleActions: 'play none none reverse',
})
devMode(1)
function home() {
  mq.add('(min-width: 992px)', () => {
    selAll('.tabs__tab').forEach((tab) => {
      const width = tab.getBoundingClientRect().width
      tab.style.width = width + 'px'
    })
  })
  stInit(-50, 'hero__video', 'hero')
  stInit(150, 'hero__bg__lines', 'hero')
  stInit(250, 'hero__bg__circles', 'hero')
  stInit(-50, 'tabs__img-shadow', 'tabs-wrap')
  stInit(-100, 'laptop-wrap', 'tabs-wrap')
  stInit(-50, 'laptop__video-wrap', 'tabs-wrap')
  stInit(-80, 'laptop__dots', 'tabs-wrap')
  stInit(100, 'ricing__featured-bg__lines', 'pricing__featured-bg')
  stInit(250, 'pricing__featured-bg__dots', 'pricing__featured-bg')
  stInit(100, 'footer__bg__lines-1', 'cta__bg')
  stInit(80, 'footer__bg__lines-2', 'cta__bg')
  stInit(150, 'footer__bg__dots-1', 'cta__bg')
  stInit(150, 'footer__bg__dots-2', 'cta__bg')
  logosSliderInit()
  testSliderInit()
  sel('.pricing__toggle-wrap').addEventListener('click', (e) => {
    sel('#pricing').checked ^= 1
  })
  mq.add('(max-width: 991px)', () => {})
  console.log('sf')
}
function terms() {}

function contact() {}
function logosSliderInit() {
  const logosSlider = new Splide('.logos__slider', {
    arrows: false,
    pagination: false,
    gap: '4rem',
    type: 'loop',
    autoWidth: true,
    autoScroll: { speed: 1, autoStart: false },
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
}
function testSliderInit() {
  const name = 'testimonials'
  const testSlider = new Splide(`.${name}__slider`, {
    arrows: false,
    pagination: false,
    gap: '2rem',
    type: 'loop',
    perPage: 1,
    speed: 1500,
    easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
  })

  const testImgSlider = new Splide(`.${name}__img-slider`, {
    type: 'fade',
    rewind: true,
    arrows: false,
    pagination: false,
    perPage: 1,
    speed: 1000,
  })
  testImgSlider.sync(testSlider)
  testSlider.mount()
  testImgSlider.mount()

  sel(`.${name}__arrows-wrap .arrow--left`).addEventListener('click', (e) => {
    testSlider.go('-1')
  })
  sel(`.${name}__arrows-wrap .arrow:not(.arrow--left)`).addEventListener('click', (e) => {
    testSlider.go('+1')
  })
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
  const comp = testSlider.Components
  let slideMetaTl
  const length = testSlider.length - 1
  testSlider.on('move', function (newIndex, oldIndex) {
    sel(`.${name}__pagination .bullet--active`).classList.remove('bullet--active')
    sel(`.${name}__pagination .bullet:nth-of-type(${testSlider.index + 1})`).classList.add('bullet--active')
    let toRight = false
    if (bulletPressed) {
      toRight = newIndex > oldIndex
      bulletPressed = false
    } else {
      toRight = (newIndex > oldIndex && !(oldIndex === 0 && newIndex === length)) || (newIndex === 0 && oldIndex === length)
    }
    const newActiveSlide$ = testSlider.Components.Elements.slides[newIndex]
    const newActiveMeta$ = newActiveSlide$.querySelectorAll('.testimonials__meta>div')
    const oldActiveSlide$ = testSlider.Components.Elements.slides[oldIndex]
    const direction = toRight ? 1 : -1
    gsap.fromTo(newActiveSlide$, { opacity: 0 }, { opacity: 1, duration: 1 })
    if (slideMetaTl?.isActive) slideMetaTl.kill()
    slideMetaTl = gsap.fromTo(
      [...newActiveMeta$],
      { opacity: 0, x: 50 * direction },
      { opacity: 1, x: 0, duration: 4, stagger: { amount: 0.3 }, ease: 'expo.out' }
    )
    gsap.fromTo(oldActiveSlide$, { opacity: 1 }, { opacity: 0, duration: 1 })
  })
}
function removeSplideClasses(slider) {
  console.log('re')

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

function stInit(distance = 0, elClassName = '', sectionClassName = '') {
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
