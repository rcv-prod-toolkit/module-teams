const namespace = 'module-teams'

const container = document.querySelector('#container')

const tick = async () => {
  const res = await window.LPTE.request({
    meta: {
      type: 'request-matches-of-the-day',
      namespace,
      version: 1
    },
  });

  displayMatches(res.matches.data)
}

window.LPTE.onready(() => {
  tick()
  window.LPTE.on(namespace, 'set', tick)
  window.LPTE.on(namespace, 'clear-matches', tick)
})

function displayMatches(matches) {
  container.innerHTML = ''
  for (const match of matches) {
    if (parseInt(match.bestOf) === 1) displaySingle(match)
    else displayBestOF(match)
  }
}

function displaySingle(match) {
  const matchDiv = document.createElement('div')
  matchDiv.classList.add('match')

  const blueTeam = match.teams.blueTeam
  const redTeam = match.teams.redTeam

  if (blueTeam.color !== '#000000') {
    matchDiv.style.setProperty('--blue-team', blueTeam.color)
  } else {
    matchDiv.style.removeProperty('--blue-team')
  }
  if (redTeam.color !== '#000000') {
    matchDiv.style.setProperty('--red-team', redTeam.color)
  } else {
    matchDiv.style.removeProperty('--red-team')
  }

  // blue tag
  const blueTag = document.createElement('h2')
  blueTag.classList.add('tag')
  blueTag.classList.add('blue')
  if (parseInt(blueTeam.score) < parseInt(redTeam.score)) {
    blueTag.classList.add('outline')
    matchDiv.classList.add('redWins')
  }
  blueTag.innerText = blueTeam.tag

  // blue tag
  const redTag = document.createElement('h2')
  redTag.classList.add('tag')
  redTag.classList.add('red')
  if (parseInt(blueTeam.score) > parseInt(redTeam.score)) {
    redTag.classList.add('outline')
    matchDiv.classList.add('blueWins')
  }
  redTag.innerText = redTeam.tag

  // vs
  const vs = document.createElement('h1')
  vs.classList.add('vs')
  vs.innerText = "vs"

  matchDiv.appendChild(blueTag)
  matchDiv.appendChild(vs)
  matchDiv.appendChild(redTag)

  container.appendChild(matchDiv)

  resizeText(blueTag)
  resizeText(redTag)
}

function displayBestOF(match) {
  const matchDiv = document.createElement('div')
  matchDiv.classList.add('match')

  const blueTeam = match.teams.blueTeam
  const redTeam = match.teams.redTeam

  if (blueTeam.color !== '#000000') {
    matchDiv.style.setProperty('--blue-team', blueTeam.color)
  } else {
    matchDiv.style.removeProperty('--blue-team')
  }
  if (redTeam.color !== '#000000') {
    matchDiv.style.setProperty('--red-team', redTeam.color)
  } else {
    matchDiv.style.removeProperty('--red-team')
  }

  // blue Team
  const blueTeamDiv = document.createElement('div')
  blueTeamDiv.classList.add('team')

  const blueTag = document.createElement('h2')
  blueTag.classList.add('tag')
  blueTag.classList.add('blue')
  if (parseInt(redTeam.score) > parseInt(match.bestOf) / 2) {
    blueTag.classList.add('outline')
    matchDiv.classList.add('redWins')
  }
  blueTag.innerText = blueTeam.tag

  const blueScore = document.createElement('h3')
  blueScore.classList.add('score')
  blueScore.classList.add('blue')
  blueScore.innerText = blueTeam.score

  const blueShards = displayShards(parseInt(blueTeam.score), match.bestOf)
  blueShards.classList.add('blue')
  if (parseInt(redTeam.score) > parseInt(match.bestOf) / 2) {
    blueShards.classList.add('outline')
  }
  blueTeamDiv.appendChild(blueTag)
  blueTeamDiv.appendChild(blueScore)
  blueTeamDiv.appendChild(blueShards)

  // blue team
  const redTeamDiv = document.createElement('div')
  redTeamDiv.classList.add('team')

  const redTag = document.createElement('h2')
  redTag.classList.add('tag')
  redTag.classList.add('red')
  if (parseInt(blueTeam.score) > parseInt(match.bestOf) / 2) {
    redTag.classList.add('outline')
    matchDiv.classList.add('blueWins')
  }
  redTag.innerText = redTeam.tag

  const redScore = document.createElement('h3')
  redScore.classList.add('score')
  redScore.classList.add('red')
  redScore.innerText = redTeam.score

  const redShards = displayShards(parseInt(redTeam.score), match.bestOf)
  redShards.classList.add('red')
  if (parseInt(blueTeam.score) > parseInt(match.bestOf) / 2) {
    redShards.classList.add('outline')
  }
  redTeamDiv.appendChild(redTag)
  redTeamDiv.appendChild(redScore)
  redTeamDiv.appendChild(redShards)

  // vs
  const vs = document.createElement('h1')
  vs.classList.add('vs')
  vs.innerText = 'vs'

  matchDiv.appendChild(blueTeamDiv)
  matchDiv.appendChild(vs)
  matchDiv.appendChild(redTeamDiv)

  container.appendChild(matchDiv)

  resizeText(blueTag)
  resizeText(redTag)
}

function displayShards(points, bestOf = 3) {
  const shardsDiv = document.createElement('div')
  shardsDiv.classList.add('shards')

  for (const i of Array(Math.ceil(bestOf / 2))) {
    const shard = document.createElement('div')
    shard.classList.add('shard')
    if (points > 0) {
      shard.classList.add('full')
      points--
    }
    shardsDiv.appendChild(shard)
  }

  return shardsDiv
}

const isOverflown = ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth

const resizeText = ( parent ) => {
  let i = 20 // let's start with 12px
  let overflow = false
  const maxSize = 75 // very huge text size

  while (!overflow && i < maxSize) {
    parent.style.fontSize = `${i}px`
    overflow = isOverflown(parent)
    if (!overflow) i++
  }

  // revert to last state where no overflow happened:
  parent.style.fontSize = `${i - 1}px`
}