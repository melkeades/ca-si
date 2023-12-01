// import './style.styl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const vh = (percent) => window.innerHeight * (percent / 100)
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.create({
  animation: gsap.to('.navbar-sticky', { y: 0, opacity: 1 }, 0),
  trigger: 'body',
  start: vh(200) + ' top',
  toggleActions: 'play none none reverse',
})
