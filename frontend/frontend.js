/**
 * @typedef { import("../types/Team").Team } Team
 */

/**
 * @type {Team[]}
 */
let teams = []

document.querySelector('#team-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const blueTeam = {
    name: document.querySelector('#blue-team-name').value,
    tag: document.querySelector('#blue-team-tag').value,
    score: parseInt(document.querySelector('#blue-team-score').value),
    logo: document.querySelector('#blue-team-logo'),
    color: document.querySelector('#blue-team-color').value,
    standing: document.querySelector('#blue-team-standing').value,
    coach: document.querySelector('#blue-team-coach').value
  }
  const redTeam = {
    name: document.querySelector('#red-team-name').value,
    tag: document.querySelector('#red-team-tag').value,
    score: parseInt(document.querySelector('#red-team-score').value),
    logo: document.querySelector('#red-team-logo'),
    color: document.querySelector('#red-team-color').value,
    standing: document.querySelector('#red-team-standing').value,
    coach: document.querySelector('#red-team-coach').value
  }

  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: 'set',
      version: 1
    },
    teams: {
      blueTeam: {
        ...blueTeam,
        logo:
          blueTeam.logo.files.length > 0
            ? `${blueTeam.name}.${blueTeam.logo.files[0].name.split('.').pop()}`
            : document.querySelector('#blue-team-logo-preview').src !== '' &&
              document.querySelector('#blue-team-logo-preview').src !==
                undefined &&
              document.querySelector('#blue-team-logo-preview').src !==
                location.toString()
            ? document
                .querySelector('#blue-team-logo-preview')
                .src.split('/')
                .pop()
            : ''
      },
      redTeam: {
        ...redTeam,
        logo:
          redTeam.logo.files.length > 0
            ? `${redTeam.name}.${redTeam.logo.files[0].name.split('.').pop()}`
            : document.querySelector('#red-team-logo-preview').src !== '' &&
              document.querySelector('#red-team-logo-preview').src !==
                undefined &&
              document.querySelector('#red-team-logo-preview').src !==
                location.toString()
            ? document
                .querySelector('#red-team-logo-preview')
                .src.split('/')
                .pop()
            : ''
      }
    },
    bestOf: parseInt(document.querySelector('#best-of').value),
    roundOf: parseInt(document.querySelector('#round-of').value)
  })

  addTeam(blueTeam)
  addTeam(redTeam)
})

function swop() {
  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: 'swop',
      version: 1
    }
  })
}

function clearMatches() {
  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: 'clear-matches',
      version: 1
    }
  })
}

function unset() {
  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: 'unset',
      version: 1
    }
  })

  document.querySelector('#blue-team-name').value = ''
  document.querySelector('#blue-team-tag').value = ''
  document.querySelector('#blue-team-score').value = 0
  document.querySelector('#blue-team-logo').value = ''
  document.querySelector('#blue-team-logo-preview').src = ''
  document.querySelector('#blue-team-color').value = '#000000'
  document.querySelector('#blue-team-standing').value = ''
  document.querySelector('#blue-team-coach').value = ''
  document.querySelector('#red-team-name').value = ''
  document.querySelector('#red-team-tag').value = ''
  document.querySelector('#red-team-score').value = 0
  document.querySelector('#red-team-logo').value = ''
  document.querySelector('#red-team-logo-preview').src = ''
  document.querySelector('#red-team-color').value = '#000000'
  document.querySelector('#red-team-standing').value = ''
  document.querySelector('#red-team-coach').value = ''
  document.querySelector('#best-of').value = 1
  document.querySelector('#round-of').value = 2
}

async function initUi() {
  const server = await window.constants.getWebServerPort()
  const location = `http://${server}/pages/op-module-teams/gfx`

  const apiKey = await window.constants.getApiKey()

  document.querySelector(
    '#embed-copy-talk'
  ).value = `${location}/talk-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#talk-gfx').src = `${location}/talk-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  document.querySelector(
    '#embed-copy-in-game'
  ).value = `${location}/in-game-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#in-game-gfx').src = `${location}/in-game-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  document.querySelector(
    '#embed-copy-pause'
  ).value = `${location}/pause-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#pause-gfx').src = `${location}/pause-gfx.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`

  const data = await window.LPTE.request({
    meta: {
      namespace: 'module-teams',
      type: 'request-current',
      version: 1
    }
  })

  displayData(data)

  const teamsData = await window.LPTE.request({
    meta: {
      namespace: 'module-teams',
      type: 'request-teams',
      version: 1
    }
  })

  displayTeamTable(teamsData)
  displayTeamList(teamsData)
}

async function displayData(data) {
  document.querySelector('#blue-team-name').value =
    data.teams.blueTeam?.name || ''
  document.querySelector('#blue-team-tag').value =
    data.teams.blueTeam?.tag || ''
  document.querySelector('#blue-team-score').value =
    data.teams.blueTeam?.score || 0
  document.querySelector('#blue-team-logo-preview').src =
    data.teams.blueTeam?.logo !== undefined && data.teams.blueTeam?.logo !== ''
      ? '/pages/op-module-teams/img/' + data.teams.blueTeam?.logo
      : ''
  document.querySelector('#blue-team-color').value =
    data.teams.blueTeam?.color || '#000000'
  document.querySelector('#blue-team-standing').value =
    data.teams.blueTeam?.standing || ''
  document.querySelector('#blue-team-coach').value =
    data.teams.blueTeam?.coach || ''

  document.querySelector('#red-team-name').value =
    data.teams.redTeam?.name || ''
  document.querySelector('#red-team-tag').value = data.teams.redTeam?.tag || ''
  document.querySelector('#red-team-score').value =
    data.teams.redTeam?.score || 0
  document.querySelector('#red-team-logo-preview').src =
    data.teams.redTeam?.logo !== undefined && data.teams.redTeam?.logo !== ''
      ? '/pages/op-module-teams/img/' + data.teams.redTeam?.logo
      : ''
  document.querySelector('#red-team-color').value =
    data.teams.redTeam?.color || '#000000'
  document.querySelector('#red-team-standing').value =
    data.teams.redTeam?.standing || ''
  document.querySelector('#red-team-coach').value =
    data.teams.redTeam?.coach || ''

  document.querySelector('#best-of').value = data.bestOf
  document.querySelector('#round-of').value = data.roundOf
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on('module-teams', 'update', displayData)
  window.LPTE.on('module-teams', 'update-teams-set', (data) => {
    displayTeamTable(data)
    displayTeamList(data)
  })
})

const teamTableBody = document.querySelector('#team-table')

function displayTeamTable(data) {
  teamTableBody.innerHTML = ''

  if (data.teams === undefined) return

  data.teams.forEach((t) => {
    const row = document.createElement('tr')

    const logoTd = document.createElement('td')
    if (t.logo !== undefined && t.logo !== '') {
      const logo = document.createElement('img')
      logo.src = '/pages/op-module-teams/img/' + t.logo
      logo.height = 50
      logoTd.appendChild(logo)
    }
    row.appendChild(logoTd)

    const nameTd = document.createElement('td')
    nameTd.innerText = t.name
    row.appendChild(nameTd)

    const tagTd = document.createElement('td')
    tagTd.innerText = t.tag
    row.appendChild(tagTd)

    const colorTd = document.createElement('td')
    if (t.color !== undefined) {
      const color = document.createElement('div')
      color.style.width = '100%'
      color.style.height = '100%'
      color.style.paddingTop = '15%'
      color.style.backgroundColor = t.color
      colorTd.appendChild(color)
    }
    row.appendChild(colorTd)

    const standingTd = document.createElement('td')
    standingTd.innerText = t.standing ?? ''
    row.appendChild(standingTd)

    const coachTd = document.createElement('td')
    coachTd.innerText = t.coach ?? ''
    row.appendChild(coachTd)

    const deleteTd = document.createElement('td')
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'btn-danger')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.title = 'Delete Team'
    deleteBtn.onclick = () => {
      deleteTeam(t.id)
    }
    deleteTd.appendChild(deleteBtn)
    row.appendChild(deleteTd)

    teamTableBody.appendChild(row)
  })
}

function deleteTeam(id) {
  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: 'delete-team',
      version: 1
    },
    id
  })
}

const teamList = document.getElementById('teams')

function displayTeamList(data) {
  if (data.teams === undefined) return

  teams = data.teams
  const length = teamList.options.length

  for (let i = length - 1; i >= 1; i--) {
    teamList.options[i] = null
  }

  data.teams.forEach((t) => {
    var option = document.createElement('option')
    option.value = t.name
    teamList.appendChild(option)
  })
}

document.querySelector('#blue-team-name').addEventListener('input', (e) => {
  setTeam(e.target.value, 'blue')
})
document.querySelector('#red-team-name').addEventListener('input', (e) => {
  setTeam(e.target.value, 'red')
})

/**
 * @param {string} name
 * @param {string} team
 */
function setTeam(name, team) {
  const teamData = teams.find((t) => t.name === name)

  if (teamData === undefined) return

  if (teamData.logo !== undefined && teamData.logo !== '') {
    document.querySelector(`#${team}-team-logo-preview`).src =
      '/pages/op-module-teams/img/' + teamData.logo
  }
  document.querySelector(`#${team}-team-tag`).value = teamData.tag
  document.querySelector(`#${team}-team-color`).value = teamData.color
  document.querySelector(`#${team}-team-standing`).value = teamData.standing
  document.querySelector(`#${team}-team-coach`).value = teamData.coach
}

document.querySelector('#add-team-form').addEventListener('submit', (e) => {
  e.preventDefault()

  addTeam({
    logo: document.querySelector('#logo'),
    name: document.querySelector('#name').value,
    tag: document.querySelector('#tag').value,
    color: document.querySelector('#color').value,
    standing: document.querySelector('#standing').value,
    coach: document.querySelector('#coach').value
  })

  document.querySelector('#logo').value = ''
  document.querySelector('#name').value = ''
  document.querySelector('#tag').value = ''
  document.querySelector('#color').value = '#000000'
  document.querySelector('#standing').value = ''
  document.querySelector('#coach').value = ''
})

/**
 * @param {Team} team
 */
async function addTeam(team) {
  const find = teams.find((t) => t.name === team.name)

  if (team.logo !== undefined && typeof team.logo !== 'string') {
    const upload = await updateFile(team.logo.files[0], team.name)
    team.logo = upload?.data.name
  }

  team.logo = team.logo ?? find?.logo

  window.LPTE.emit({
    meta: {
      namespace: 'module-teams',
      type: find !== undefined ? 'update-team' : 'add-team',
      version: 1
    },
    id: find?.id,
    ...team
  })
}

document.querySelector('#blue-team-logo').addEventListener('change', (e) => {
  const files = e.target.files ?? []
  if (!files.length || !window.FileReader) return

  if (/^image/.test(files[0].type)) {
    document.querySelector('#blue-team-logo-preview').src = URL.createObjectURL(
      files[0]
    )
  }
})
document.querySelector('#red-team-logo').addEventListener('change', (e) => {
  const files = e.target.files ?? []
  if (!files.length || !window.FileReader) return

  if (/^image/.test(files[0].type)) {
    document.querySelector('#red-team-logo-preview').src = URL.createObjectURL(
      files[0]
    )
  }
})

async function updateFile(file, name) {
  if (!file) return

  const ext = file.name.split('.').pop()

  const form = new FormData()
  form.append('file', file, `module-teams/frontend/img/${name}.${ext}`)
  form.append('path', 'module-teams/frontend/img')

  const response = await fetch('/upload', {
    method: 'POST',
    body: form
  })

  const json = await response.json()

  return json
}
