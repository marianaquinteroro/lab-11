class Agente {
    constructor(nombre, rol, habilidades, imagen) {
        this.nombre = nombre;
        this.rol = rol;
        this.habilidades = habilidades;
        this.imagen = imagen;
    }
}

async function getAgents() {
    const response = await fetch('https://valorant-api.com/v1/agents');
    const data = await response.json();
    return data.data;
}

async function fetchAndCreateAgents() {
    let rawAgents = await getAgents();
    let agents = [];

    for (let i = 0; i < rawAgents.length; i++) {
        let agentData = rawAgents[i];
        let nombre = agentData.displayName;
        
        let rol;
        if (agentData.role) {
            rol = agentData.role.displayName;
        } else {
            rol = 'No role';
        }
        
        let habilidades = [];
        for (let j = 0; j < agentData.abilities.length; j++) {
            habilidades.push(agentData.abilities[j].displayName);
        }

        let imagen = agentData.displayIcon;
        let agente = new Agente(nombre, rol, habilidades, imagen);
        agents.push(agente);
    }

    renderAgents(agents);
    return agents;
}

function renderAgents(agents) {
    let container = document.getElementById('agents-container');
    container.innerHTML = '';

    for (let i = 0; i < agents.length; i++) {
        let agent = agents[i];
        
        let agentElement = document.createElement('div');
        agentElement.className = 'agent';

        let agentImage = document.createElement('img');
        agentImage.src = agent.imagen;
        agentImage.alt = agent.nombre;
        agentImage.className = 'agent-image';

        let agentName = document.createElement('h2');
        agentName.textContent = agent.nombre;

        let agentRole = document.createElement('p');
        agentRole.innerHTML = '<strong>Role:</strong> ' + agent.rol;

        let abilitiesList = document.createElement('ul');
        for (let j = 0; j < agent.habilidades.length; j++) {
            let abilityItem = document.createElement('li');
            abilityItem.textContent = agent.habilidades[j];
            abilitiesList.appendChild(abilityItem);
        }

        agentElement.appendChild(agentImage);
        agentElement.appendChild(agentName);
        agentElement.appendChild(agentRole);
        agentElement.appendChild(abilitiesList);

        container.appendChild(agentElement);
    }
}

function setupSearch(agents) {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', () => {
        const searchText = searchBar.value.toLowerCase();
        const filteredAgents = agents.filter(agent => agent.nombre.toLowerCase().includes(searchText));
        renderAgents(filteredAgents);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const agents = await fetchAndCreateAgents();
    setupSearch(agents);
});
