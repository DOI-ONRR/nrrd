import React, { useState, useEffect } from 'react'

const useWindowScroll = () => {
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let scrollPosition = 0

    const pageHeight = document.body.offsetHeight
    const viewportHeight = window.innerHeight

    function handleScroll () {
      const newScrollPosition = window.scrollY

      if (newScrollPosition === scrollPosition) {
        return
      }

      if (newScrollPosition < 0 || newScrollPosition + viewportHeight > pageHeight) {
        return
      }

      const shouldShow = newScrollPosition < 60
      setIsActive(shouldShow)

      scrollPosition = newScrollPosition
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return isActive
}

export default useWindowScroll
