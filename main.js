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
ScrollTrigger.create({
  animation: gsap.to('.navbar-sticky', { y: 0, opacity: 1 }, 0),
  trigger: 'body',
  start: vh(200) + ' top',
  toggleActions: 'play none none reverse',
})
