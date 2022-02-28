const namespace = 'module-teams'

$('#embed-copy-talk').val(`${location.href}/gfx/talk-gfx.html`)
$('#embed-copy-in-game').val(`${location.href}/gfx/in-game-gfx.html`)
$('#embed-copy-pause').val(`${location.href}/gfx/pause-gfx.html`)

$('#team-form').on('submit', (e) => {
  e.preventDefault()

  const blueTeam = {
    name: $('#blue-team-name').val(),
    tag: $('#blue-team-tag').val(),
    score: parseInt($('#blue-team-score').val())
  }
  const redTeam = {
    name: $('#red-team-name').val(),
    tag: $('#red-team-tag').val(),
    score: parseInt($('#red-team-score').val())
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
})

function swop() {
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
  $('#red-team-name').val('')
  $('#red-team-tag').val('')
  $('#red-team-score').val(0)
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

  $('#red-team-name').val(data.teams.redTeam?.name || '')
  $('#red-team-tag').val(data.teams.redTeam?.tag || '')
  $('#red-team-score').val(data.teams.redTeam?.score || 0)

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

  data.teams.forEach(t => {
    const row = document.createElement('tr')

    const logoTd = document.createElement('td')
    if (t.logo !== undefined) {
      const logo = document.createElement('img')
      logo.src = t.logo
      logoTd.appendChild(logo)
    }
    row.appendChild(logoTd)

    const nameTd = document.createElement('td')
    nameTd.innerText = t.name
    row.appendChild(nameTd)

    const tagTd = document.createElement('td')
    tagTd.innerText = t.tag
    row.appendChild(tagTd)

    const handleTd = document.createElement('td')
    handleTd.innerText = t.tag
    row.appendChild(handleTd)

    const colorTd = document.createElement('td')
    if (t.color !== undefined) {
      const color = document.createElement('span')
      color.style.width = '100%'
      color.style.height = '100%'
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
      deleteTeam(t._id)
    }
    deleteTd.appendChild(deleteBtn)
    row.appendChild(deleteTd)

    teamTableBody.appendChild(row)
  })
}

function deleteTeam (_id) {
  window.LPTE.emit({
    meta: {
      namespace,
      type: 'delete-team',
      version: 1
    },
    _id
  })
}

const teamList = document.getElementById('teams');

function displayTeamList (data) {
  const length = teamList.options.length

  for (let i = length - 1; i >= 1; i--) {
    teamList.options[i] = null
  }

  data.teams.forEach((t, i) => {
    teamList.options.add(new Option(t.name, t._id), [i + 1])
  })
}
