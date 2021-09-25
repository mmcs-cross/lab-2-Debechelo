document.addEventListener('DOMContentLoaded', function () {
  const state = getStoredStateOrDefault({ 
    counter: 40
  })

  const $incrButton = document.querySelector('.incr')
  const $decrButton = document.querySelector('.decr')

  const $gauge = document.querySelector('.gauge')
  setGaugePercent($gauge, state.counter)
  
  $incrButton.addEventListener('click', function() {
    state.counter = Math.min(state.counter + 10, 100)
    saveState(state)
    setGaugePercent($gauge, state.counter)
  })

  $decrButton.addEventListener('click', function() {
    state.counter = Math.max(state.counter - 10, 0)
    saveState(state)
    setGaugePercent($gauge, state.counter)
  })
})