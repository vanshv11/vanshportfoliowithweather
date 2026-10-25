// Draw marker annotations once, the first time they scroll into view.
const annotations = document.querySelectorAll<Element>('.annotation')

if (!('IntersectionObserver' in window)) {
  annotations.forEach((el) => el.classList.add('is-drawn'))
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-drawn')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  )
  annotations.forEach((el) => observer.observe(el))
}
