/**
 * @typedef { import("../types/Team").Team } Team
*/

const namespace = 'module-teams'
/**
 * @type {Team[]}
 */
let teams = []

$('#embed-copy-talk').val(`${location.href}/gfx/talk-gfx.html${window.apiKey !== null ? '?apikey=' + window.apiKey : ''}`)
$('#embed-copy-in-game').val(`${location.href}/gfx/in-game-gfx.html${window.apiKey !== null ? '?apikey=' + window.apiKey : ''}`)
$('#embed-copy-pause').val(`${location.href}/gfx/pause-gfx.html${window.apiKey !== null ? '?apikey=' + window.apiKey : ''}`)

$('#team-form').on('submit', (e) => {
  e.preventDefault()

  const blueTeam = {
    name: $('#blue-team-name').val(),
    tag: $('#blue-team-tag').val(),
    score: parseInt($('#blue-team-score').val()),
    logo: $('#blue-team-logo-preview').attr('src'),
    color: $('#blue-team-color').val(),
    standing: $('#blue-team-standing').val()
  }
  const redTeam = {
    name: $('#red-team-name').val(),
    tag: $('#red-team-tag').val(),
    score: parseInt($('#red-team-score').val()),
    logo: $('#red-team-logo-preview').attr('src'),
    color: $('#red-team-color').val(),
    standing: $('#red-team-standing').val()
  }

  window.LPTE.emit({
    meta: {
      namespace,
      type: 'set',
      version: 1
    },
    teams: {
      blueTeam,
      redTeam
    },
    bestOf: parseInt($('#best-of').val()),
    roundOf: parseInt($('#round-of').val())
  })

  addTeam(blueTeam)
  addTeam(redTeam)
})

function swop () {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'swop',
      version: 1
    }
  })
}

function clearMatches() {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'clear-matches',
      version: 1
    }
  })
}

function unset() {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'unset',
      version: 1
    },
  })

  $('#blue-team-name').val('')
  $('#blue-team-tag').val('')
  $('#blue-team-score').val(0)
  $('#blue-team-logo').val('')
  $('#blue-team-logo-preview').attr('src', '')
  $('#blue-team-color').val('#000000')
  $('#blue-team-standing').val('')
  $('#red-team-name').val('')
  $('#red-team-tag').val('')
  $('#red-team-score').val(0)
  $('#red-team-logo').val('')
  $('#red-team-logo-preview').attr('src', '')
  $('#red-team-color').val('#000000')
  $('#red-team-standing').val('')
  $('#best-of').val(1)
  $('#round-of').val(2)
}

async function initUi () {
  const data = await window.LPTE.request({
    meta: {
      namespace,
      type: 'request-current',
      version: 1
    }
  })

  displayData(data)

  const teamsData = await window.LPTE.request({
    meta: {
      namespace,
      type: 'request-teams',
      version: 1
    }
  })

  displayTeamTable(teamsData)
  displayTeamList(teamsData)
}

async function displayData (data) {
  $('#blue-team-name').val(data.teams.blueTeam?.name || '')
  $('#blue-team-tag').val(data.teams.blueTeam?.tag || '')
  $('#blue-team-score').val(data.teams.blueTeam?.score || 0)
  $('#blue-team-logo-preview').attr('src', data.teams.blueTeam?.logo || '')
  $('#blue-team-color').val(data.teams.blueTeam?.color || '#000000')
  $('#blue-team-standing').val(data.teams.blueTeam?.standing || '')

  $('#red-team-name').val(data.teams.redTeam?.name || '')
  $('#red-team-tag').val(data.teams.redTeam?.tag || '')
  $('#red-team-score').val(data.teams.redTeam?.score || 0)
  $('#red-team-logo-preview').attr('src', data.teams.redTeam?.logo || '')
  $('#red-team-color').val(data.teams.redTeam?.color || '#000000')
  $('#red-team-standing').val(data.teams.redTeam?.standing || '')

  $('#best-of').val(data.bestOf)
  $('#round-of').val(data.roundOf)
}

window.LPTE.onready(() => {
  initUi()
  window.LPTE.on(namespace, 'update', displayData)
  window.LPTE.on(namespace, 'update-teams-set', (data) => {
    displayTeamTable(data)
    displayTeamList(data)
  })
})

const teamTableBody = document.querySelector('#team-table')

function displayTeamTable (data) {
  teamTableBody.innerHTML = ''

  if (data.teams === undefined) return

  data.teams.forEach(t => {
    const row = document.createElement('tr')

    const logoTd = document.createElement('td')
    if (t.logo !== undefined) {
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

    const deleteTd = document.createElement('td')
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn', 'btn-danger')
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteBtn.onclick = () => {
      deleteTeam(t.id)
    }
    deleteTd.appendChild(deleteBtn)
    row.appendChild(deleteTd)

    teamTableBody.appendChild(row)
  })
}

function deleteTeam (id) {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'delete-team',
      version: 1
    },
    id
  })
}

const teamList = document.getElementById('teams');

function displayTeamList (data) {
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

$('#blue-team-name').on('input', (e) => {
  setTeam(e.target.value, 'blue')
})
$('#red-team-name').on('input', (e) => {
  setTeam(e.target.value, 'red')
})

/**
 * @param {string} name 
 * @param {string} team 
 */
function setTeam (name, team) {
  const teamData = teams.find(t => t.name === name)

  if (teamData === undefined) return

  $(`#${team}-team-logo-preview`).attr('src', '/pages/op-module-teams/img/' + teamData.logo)
  $(`#${team}-team-tag`).val(teamData.tag)
  $(`#${team}-team-color`).val(teamData.color)
  $(`#${team}-team-standing`).val(teamData.standing)
}

$('#add-team-form').on('submit', (e) => {
  e.preventDefault()
  console.log(e)

  addTeam({
    logo: $('#logo')[0],
    name: $('#name').val(),
    tag: $('#tag').val(),
    color: $('#color').val(),
    standing: $('#standing').val()
  })

  $('#logo').val('')
  $('#name').val('')
  $('#tag').val('')
  $('#color').val('#000000')
  $('#standing').val('')
})

/**
 * @param {Team} team
 */
async function addTeam (team) {
  const find = teams.find(t => t.name === team.name)

  if (find !== undefined) return

  if (team.logo !== undefined) {
    const upload = await updateFile(team.logo.files[0], $('#name').val())
    team.logo = upload?.data.name
  }

  window.LPTE.emit({
    meta: {
      namespace,
      type: 'add-team',
      version: 1
    },
    ...team
  })
}

$('#blue-team-logo').on('change', (e) => {
  const files = e.target.files ?? []
  if (!files.length || !window.FileReader) return

  if (/^image/.test(files[0].type)) {
    document.querySelector('#blue-team-logo-preview').src = URL.createObjectURL(files[0])
  }
})
$('#red-team-logo').on('change', (e) => {
  const files = e.target.files ?? []
  if (!files.length || !window.FileReader) return

  if (/^image/.test(files[0].type)) {
    document.querySelector('#red-team-logo-preview').src = URL.createObjectURL(files[0])
  }
})

async function updateFile (file, name) {
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