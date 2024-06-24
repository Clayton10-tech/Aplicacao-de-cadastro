'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const preencherFormulario = (endereco) => {
    document.getElementById('endereco').value = endereco.logradouro
    document.getElementById('bairro').value = endereco.bairro
    document.getElementById('cidade').value = endereco.localidade
    document.getElementById('estado').value = endereco.uf 
}

const pesquisarCep = async() => {
    const cep = document.getElementById('cep').value
    const url = `http://viacep.com.br/ws/${cep}/json/`
    const dados = await fetch(url)
    const endereco = await dados.json()
    preencherFormulario(endereco)



    //fetch(url).then(responde => responde.json()).then(console.log)
    
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []

const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

//DELETE

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

//UPDATE
const updateCliente = (index, cliente) => {
    const dbClient = readClient()
    dbClient[index] = cliente
    setLocalStorage(dbClient)
}

//READ
const readClient = () => getLocalStorage()

//CRUD CREAT
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
    
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//INTERAÇÃO COM O USUARIO
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cep: document.getElementById('cep').value,
            endereco: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value
        }

        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
        createClient(client)
        updateTable()
        closeModal()
        } else {
            updateCliente(index, client)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML =`
    <td>${client.nome}</td>
    
    <td>${client.celular}</td>
    <td>${client.cep}</td>
    <td>${client.endereco}</td>
    <td>${client.numero}</td>
    <td>${client.cidade}</td>
    <td>${client.estado}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">editar</button>
        <button type="button" class="button red" id="delete-${index}">excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cep').value = client.cep
    document.getElementById('endereco').value = client.endereco
    document.getElementById('numero').value = client.numero
    document.getElementById('bairro').value = client.bairro
    document.getElementById('cidade').value = client.cidade
    document.getElementById('estado').value = client.estado
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button'){
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
            deleteClient(index)
            updateTable()
            }
        }
    }
}

updateTable()

//EVENTOS
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('cep')
    .addEventListener('focusout', pesquisarCep)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)    
