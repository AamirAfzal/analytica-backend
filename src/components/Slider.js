/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useState, useEffect, useRef } from 'react'
import { css, jsx } from '@emotion/core'
import SliderContent from './SliderContent'
import Slide from './Slide'
import Arrow from './Arrow'
import Dots from './Dots'
import './Slider.css';

const getWidth = () => window.innerWidth

/**
 * @function Slider
 */

const Slider = props => {
  const {slides} = props

  const firstSlide = slides[0]
  const secondSlide = slides[1]
  const lastSlide = slides[slides.length-1]

  const [state, setState] = useState({
    activeIndex: 0,
    translate: getWidth(),
    transition: 0.45,
    _slides:[lastSlide,firstSlide,secondSlide]
  })

  const { translate, transition, activeIndex, _slides } = state

  const autoPlayref = useRef()
  const transitionRef = useRef()
  const resizeRef = useRef()

  useEffect(()=>{
      autoPlayref.current = nextSlide
      transitionRef.current = smoothTransition
      resizeRef.current = handleResize
  })

  useEffect(()=>{
      const play = () => {
          autoPlayref.current()
      }

    const smooth = (e) => {
      if(e.target.className.includes('SliderContent')){
        transitionRef.current()
      }
    }

    const resize = () =>{
      resizeRef.current()
    }
    let interval = null 
    const transitionEnd = window.addEventListener('transitionend', smooth)
    const onResize = window.addEventListener('resize',resize)

     if(props.autoplay) interval = setInterval(play, props.autoplay*1000)
        
     return () => {
       window.removeEventListener('transitionend', transitionEnd)
       window.removeEventListener('resize', onResize)

       if (props.autoplay){
         clearInterval(interval)
       }
     }
  },[props.autoplay])

  useEffect(() => {
    if (transition === 0) setState({ ...state, transition: 0.45 })
  }, [transition])
  
  const handleResize = () => {
    setState({ ...state, translate: getWidth(), transition: 0 })
  }

  const smoothTransition = () => {
    let _slides = []
  
    // We're at the last slide.
    if (activeIndex === slides.length - 1)
      _slides = [slides[slides.length - 2], lastSlide, firstSlide]
    // We're back at the first slide. Just reset to how it was on initial render
    else if (activeIndex === 0) _slides = [lastSlide, firstSlide, secondSlide]
    // Create an array of the previous last slide, and the next two slides that follow it.
    else _slides = slides.slice(activeIndex - 1, activeIndex + 2)
  
    setState({
      ...state,
      _slides,
      transition: 0,
      translate: getWidth()
    })
  }
  

  const nextSlide = () =>
  setState({
    ...state,
    translate: translate + getWidth(),
    activeIndex: activeIndex === slides.length - 1 ? 0 : activeIndex + 1
  })

const prevSlide = () =>
  setState({
    ...state,
    translate: 0,
    activeIndex: activeIndex === 0 ? slides.length - 1 : activeIndex - 1
  })

  
  return (
    <div className='SliderMain'>
    <div css={SliderCSS}>
      <SliderContent
        translate={translate}
        transition={transition}
        width={getWidth() * _slides.length}
      >
        {_slides.map((slide, i) => (
          <Slide key={slide + i} content={slide} />
        ))}
      </SliderContent>

      {!props.autoplay && (
          <>
            <Arrow direction="left" handleClick={prevSlide} />
            <Arrow direction="right" handleClick={nextSlide} />
          </>
      )}

      <Dots slides={props.slides} activeIndex={activeIndex} />
    </div>
    </div>
  )
}
Slider.defaultProps = {
    slides:[],
    autoplay: null
}

const SliderCSS = css`
  position: relative;
  height: 90vh;
  width: inherit;
  margin: 0 auto;
  overflow: hidden;
`
export default Slider